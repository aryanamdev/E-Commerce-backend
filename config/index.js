import dotenv from "dotenv";
import { mongo } from "mongoose";

dotenv.config;

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.MONGO_URL,
};

export default config;
