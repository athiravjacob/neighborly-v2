import express from "express";
import { connectDB } from "../infrastructure/persistence/mongo/connection";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
dotenv.config();

const app = express()
app.use(express.json())
const PORT = process.env.PORT

async function start() {
    await connectDB(); 

    app.use("/api/auth", authRoutes);

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }
  
  start().catch(err => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
  