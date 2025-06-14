import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhook.js";

connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Webhook route (needs raw body)
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// Middleware for JSON parsing (for all other routes)
app.use(express.json());

// Clerk middleware for authentication (skip webhook)
app.use(clerkMiddleware());

// Test route
app.get("/", (req, res) => {
  res.send("API is working ");
});

// Set port from environment or default to 4000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
