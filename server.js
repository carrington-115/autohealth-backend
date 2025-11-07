import express from "express";
import { configDotenv } from "dotenv";
import authRouter from "./src/routers/auth.routers.js";
import connectDB from "./src/config/database.config.js";

configDotenv();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT || 5000);
