import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Static folder
app.use(express.static("public"));

// Cookies
app.use(cookieParser());

// Routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

// Test route
app.get("/", (req, res) => {
    res.send("Server running...");
});

export { app };