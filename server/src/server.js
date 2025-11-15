import express from "express";
import {connectDB} from "./lib/db.js"
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});