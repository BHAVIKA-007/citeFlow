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
import paperRouter from "./routes/paper.routes.js";
import citationRouter from "./routes/citation.routes.js";
import noteRouter from "./routes/note.routes.js";
import tagRouter from "./routes/tag.routes.js";
import researchTopicRouter from "./routes/researchTopic.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/papers", paperRouter);
app.use("/api/v1/citations", citationRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/topics", researchTopicRouter);

// Test route
app.get("/", (req, res) => {
    res.send("Server running...");
});

export { app };