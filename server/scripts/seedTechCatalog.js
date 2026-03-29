import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Competitor from "../models/Competitor.js";
import PriceHistory from "../models/PriceHistory.js";
import { buildTechCatalogSeed } from "../data/techCatalogSeed.js";

dotenv.config();

const seedTechCatalog = async () => {
  await connectDB();

  const catalog = buildTechCatalogSeed();
  const productNames = catalog.map((item) => item.name);
  const existingProducts = await Product.find({ name: { $in: productNames } });
  const existingProductMap = new Map(existingProducts.map((product) => [product.name, product]));

  let createdProducts = 0;
  let updatedProducts = 0;
  let competitorCount = 0;
  let historyCount = 0;

  for (const item of catalog) {
    let product = existingProductMap.get(item.name);

    if (product) {
      product.category = item.category;
      product.currentPrice = item.currentPrice;
      await product.save();
      updatedProducts += 1;
    } else {
      product = await Product.create({
        name: item.name,
        category: item.category,
        currentPrice: item.currentPrice
      });
      createdProducts += 1;
    }

    await Promise.all([
      Competitor.deleteMany({ productId: product._id }),
      PriceHistory.deleteMany({ productId: product._id })
    ]);

    if (item.competitors.length > 0) {
      await Competitor.insertMany(
        item.competitors.map((competitor) => ({
          productId: product._id,
          ...competitor
        }))
      );
      competitorCount += item.competitors.length;
    }

    if (item.priceHistory.length > 0) {
      await PriceHistory.insertMany(
        item.priceHistory.map((historyEntry) => ({
          productId: product._id,
          ...historyEntry
        }))
      );
      historyCount += item.priceHistory.length;
    }
  }

  console.log(
    JSON.stringify(
      {
        productsGenerated: catalog.length,
        productsCreated: createdProducts,
        productsUpdated: updatedProducts,
        competitorsInserted: competitorCount,
        historyRowsInserted: historyCount
      },
      null,
      2
    )
  );

  process.exit(0);
};

seedTechCatalog().catch((error) => {
  console.error(error);
  process.exit(1);
});
