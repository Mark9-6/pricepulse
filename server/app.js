import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES HERE
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;