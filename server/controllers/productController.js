import Product from "../models/Product.js";
import Competitor from "../models/Competitor.js";
import PriceHistory from "../models/PriceHistory.js";
import { buildPricingInsight, buildPricingInsights } from "../services/pricingService.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    await PriceHistory.create({
      productId: product._id,
      price: product.currentPrice,
      source: "self"
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const productIds = products.map((product) => product._id);

    const [competitors, priceHistory] = await Promise.all([
      Competitor.find({ productId: { $in: productIds } }).lean(),
      PriceHistory.find({ productId: { $in: productIds } }).sort({ date: 1 }).lean()
    ]);

    const competitorsByProductId = competitors.reduce((grouped, competitor) => {
      const key = String(competitor.productId);
      grouped[key] ??= [];
      grouped[key].push(competitor);
      return grouped;
    }, {});

    const historyByProductId = priceHistory.reduce((grouped, historyEntry) => {
      const key = String(historyEntry.productId);
      grouped[key] ??= [];
      grouped[key].push(historyEntry);
      return grouped;
    }, {});

    const pricingInsights = await buildPricingInsights(
      products.map((product) => ({
        product,
        competitors: competitorsByProductId[String(product._id)] ?? [],
        priceHistory: historyByProductId[String(product._id)] ?? []
      }))
    );

    const enrichedProducts = products.map((product, index) => {
      const pricingInsight = pricingInsights[index];

      return {
        ...product,
        offeringType: "our-offering",
        ourPrice: pricingInsight?.ourOfferPrice ?? product.currentPrice,
        competitors: (competitorsByProductId[String(product._id)] ?? [])
          .slice()
          .sort((left, right) => left.price - right.price),
        pricingInsight
      };
    });

    res.json(enrichedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const [competitors, priceHistory] = await Promise.all([
      Competitor.find({ productId: product._id }).sort({ price: 1 }).lean(),
      PriceHistory.find({ productId: product._id }).sort({ date: 1 }).lean()
    ]);
    const pricingInsight = await buildPricingInsight({
      product,
      competitors,
      priceHistory
    });

    res.json({
      ...product,
      offeringType: "our-offering",
      ourPrice: pricingInsight?.ourOfferPrice ?? product.currentPrice,
      competitors,
      priceHistory,
      pricingInsight
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product details",
      error: error.message
    });
  }
};
