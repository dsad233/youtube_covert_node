import dotenv from "dotenv";

dotenv.config();

export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_DB = Number(process.env.REDIS_DB);
export const REDIS_USERNAME = String(process.env.REDIS_USERNAME) || "default";
export const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD) || undefined;
