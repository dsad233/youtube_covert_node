import dotenv from "dotenv";
dotenv.config();

/**
 * Default
 */
export const NODE_ENV = String(process.env.NODE_ENV);
export const LISTENING_PORT = Number(process.env.LISTENING_PORT);
export const SERVER_URL = String(process.env.SERVER_URL);

export const MP3_TEMP_FILENAME = String(process.env.MP3_TEMP_FILENAME);
export const MP3_FILENAME = String(process.env.MP3_FILENAME);

export const MP4_TEMP_FILENAME = String(process.env.MP4_TEMP_FILENAME);
export const MP4_FILENAME = String(process.env.MP4_FILENAME);

/**
 * Redis
 */
export const REDIS_HOST = String(process.env.REDIS_HOST);
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_DB = Number(process.env.REDIS_DB);
export const REDIS_USERNAME = String(process.env.REDIS_USERNAME) || "default";
export const REDIS_PASSWORD = String(process.env.REDIS_PASSWORD) || undefined;
