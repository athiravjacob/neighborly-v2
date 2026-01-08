import express from "express";
import { connectDB } from "../infrastructure/persistence/mongo/connection";
import dotenv from "dotenv";
dotenv.config();

const app = express()
app.use(express.json())
connectDB()
const PORT = process.env.PORT
app.listen(PORT, () => console.log("Server started on port 3000"));