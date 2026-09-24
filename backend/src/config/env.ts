import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: requiredEnv("DATABASE_URL"),

  JWT_SECRET: requiredEnv("JWT_SECRET"),

  NODE_ENV: process.env.NODE_ENV || "development",

  AI_SERVICE_URL:
    process.env.AI_SERVICE_URL || "http://localhost:8000"
};