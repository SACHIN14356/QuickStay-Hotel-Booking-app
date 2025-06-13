import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhook.js";



connectDB()
const app = express();

// Enable CORS
app.use(cors());

// middleware
app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk", clerkWebhooks)


// Test route
app.get("/", (req, res) => {
  res.send("API is working ");
});

// Set port from environment or default to 3000
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
