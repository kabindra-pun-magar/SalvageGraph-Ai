import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { prisma } from "./config/database";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import materialRoutes from "./routes/material.routes";

import { errorMiddleware } from "./middleware/error.middleware";
import { successResponse } from "./utils/api-response";
import passportRoutes from "./routes/passport.routes";
import materialRequirementRoutes from "./routes/material-requirement.routes";
import matchingRoutes from "./routes/matching.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import publicPassportRoutes from "./routes/public-passport.routes";
import mapRoutes from "./routes/map.routes";


const app = express();

// --------------------------------------------------
// Global Middleware
// --------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/api/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json(
      successResponse(
        "SalvageGraph API and database are healthy"
      )
    );
  } catch (error) {
    next(error);
  }
});

// --------------------------------------------------
// API Routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api", publicPassportRoutes);

app.use("/api", passportRoutes);

app.use("/api", materialRequirementRoutes);

app.use("/api", matchingRoutes);

app.use("/api", recommendationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/map", mapRoutes);

// --------------------------------------------------
// Error Middleware
// --------------------------------------------------

app.use(errorMiddleware);

export default app;