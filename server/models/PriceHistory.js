import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    source: {
      type: String,
      default: "self" // or "Amazon", "Flipkart"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("PriceHistory", priceHistorySchema);