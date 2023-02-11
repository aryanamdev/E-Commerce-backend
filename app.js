require(dotenv).config();
const express = require("express");

// importing PORT
const { PORT } = process.env;

export const app = express();
