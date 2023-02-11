require(dotenv).config();
const express = require("express");

import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const { PORT } = process.env;
export const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(morgan("tiny"));