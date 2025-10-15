import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);

export default app;
