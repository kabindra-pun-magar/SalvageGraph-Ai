import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware";
import { successResponse } from "./utils/api-response";
import { prisma } from "./config/database";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/api/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json(
      successResponse("SalvageGraph API and database are healthy")
    );
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware);

export default app;