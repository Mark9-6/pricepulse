import express from "express";
import { suggestPrice } from "../controllers/pricingController.js";
import { createProduct, getProductById, getProducts } from "../controllers/productController.js";
import { createCompetitor, getCompetitors } from "../controllers/competitorController.js";
const router = express.Router();

router.post("/suggest", suggestPrice);
router.post("/product", createProduct);
router.get("/products", getProducts);
router.get("/products/:productId", getProductById);


router.post("/competitor", createCompetitor);
router.get("/competitors", getCompetitors);


export default router;
