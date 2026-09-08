import redis from "redis";
import {
  REDIS_PASSWORD,
  REDIS_USERNAME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_DB,
} from "../common/keys.js";

//* Redis 연결
export const redisClient = redis.createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
  legacyMode: true,
}); // legacy 모드 반드시 설정 !!
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
  process.exit(1);
});
redisClient.connect().then(); // redis v4 연결 (비동기)
