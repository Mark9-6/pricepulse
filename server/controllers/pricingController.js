import Product from "../models/Product.js";
import Competitor from "../models/Competitor.js";
import PriceHistory from "../models/PriceHistory.js";
import { buildPricingInsight } from "../services/pricingService.js";

export const suggestPrice = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [competitors, priceHistory] = await Promise.all([
      Competitor.find({ productId }).lean(),
      PriceHistory.find({ productId }).sort({ date: 1 }).lean()
    ]);

    const pricingInsight = await buildPricingInsight({
      product,
      competitors,
      priceHistory
    });

    res.json({
      productId: product._id,
      productName: product.name,
      currentPrice: product.currentPrice,
      ourPrice: pricingInsight.ourOfferPrice,
      suggestedPrice: pricingInsight.suggestedPrice,
      pricingInsight
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating simulated price prediction",
      error: error.message
    });
  }
};
