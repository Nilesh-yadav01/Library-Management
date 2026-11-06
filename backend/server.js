import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// Test API
app.get("/", (req, res) => {

    res.json({
        message: "Library Management API Running"
    });

});

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/issues", issueRoutes);

// 404
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {

    app.listen(PORT, () => {

        console.log(`Server running on port ${PORT}`);

    });

}).catch((error) => {

    console.log("Server startup failed:", error.message);

});