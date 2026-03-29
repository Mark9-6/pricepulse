import { predictPricingInsight, predictPricingInsights } from "./mlPricingService.js";

const roundToNearestTen = (value) => Math.round(value / 10) * 10;
const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export const getSuggestedPrice = ({ ourPrice, competitorPrice, demand }) => {
  let rulePrice;

  if (competitorPrice < ourPrice) {
    rulePrice = competitorPrice - Math.min(500, competitorPrice * 0.02);
  } else if (demand > 0.7) {
    rulePrice = ourPrice + Math.max(250, ourPrice * 0.015);
  } else {
    rulePrice = ourPrice;
  }

  return roundToNearestTen(rulePrice);
};

const mergePredictionWithRules = ({ product, mlPrediction }) => {
  const referenceCompetitorPrice = mlPrediction.competitorMinPrice || product.currentPrice;
  const currentPrice = Number(product.currentPrice) || 0;
  const ruleBasedPrice = getSuggestedPrice({
    ourPrice: currentPrice,
    competitorPrice: referenceCompetitorPrice,
    demand: mlPrediction.demandScore
  });
  const suggestedPrice = roundToNearestTen(
    mlPrediction.predictedPrice * 0.7 + ruleBasedPrice * 0.3
  );
  const averagedOfferPrice = (Number(mlPrediction.predictedPrice) + suggestedPrice) / 2;

  let competitiveOfferPrice = averagedOfferPrice;

  if (mlPrediction.competitorCount > 0) {
    const marketCompetitiveCap = Math.min(
      Number(mlPrediction.competitorAveragePrice) * 0.995,
      Number(mlPrediction.competitorMinPrice) * 1.01
    );

    competitiveOfferPrice = Math.min(competitiveOfferPrice, marketCompetitiveCap);
  }

  const ourOfferPrice = roundToNearestTen(
    clamp(competitiveOfferPrice, currentPrice * 0.82, Math.max(currentPrice * 1.08, competitiveOfferPrice))
  );
  const savingsVsLowestWebsite = roundToNearestTen(
    Math.max(0, Number(mlPrediction.competitorMinPrice || 0) - ourOfferPrice)
  );
  const savingsVsAverageWebsite = roundToNearestTen(
    Math.max(0, Number(mlPrediction.competitorAveragePrice || 0) - ourOfferPrice)
  );

  return {
    ...mlPrediction,
    ruleBasedPrice,
    suggestedPrice,
    ourOfferPrice,
    savingsVsLowestWebsite,
    savingsVsAverageWebsite,
    pricingStrategy: "Average of ML prediction and hybrid recommendation, tuned to stay competitive with tracked websites."
  };
};

export const buildPricingInsight = async ({ product, competitors = [], priceHistory = [] }) => {
  const mlPrediction = await predictPricingInsight({
    product,
    competitors,
    priceHistory
  });

  return mergePredictionWithRules({ product, mlPrediction });
};

export const buildPricingInsights = async (items) => {
  const predictions = await predictPricingInsights(items);

  return items.map((item, index) =>
    mergePredictionWithRules({
      product: item.product,
      mlPrediction: predictions[index]
    })
  );
};
