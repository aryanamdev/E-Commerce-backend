import dotenv from "dotenv";
import { mongo } from "mongoose";

dotenv.config;

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d",
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.MONGO_URL,
  SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
  SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
  SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
  SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
  SMTP_MAIL_EMAIL: process.env.SMTP_MAIL_EMAIL,
};

export default config;
