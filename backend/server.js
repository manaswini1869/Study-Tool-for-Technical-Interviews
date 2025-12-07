import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import questionsRouter from "./routes/questions.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Study Tool backend is running");
});

app.use("/api/questions", questionsRouter);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
