import { redisClient } from "../redisConfig.js";

export class RedisRepository {
  /**
   * @param key string
   * @returns string
   */
  static async get(key) {
    return await redisClient.get(key);
  }

  /**
   * @param key string
   * @param value string
   */
  static async set(key, value) {
    await redisClient.set(key, value);
  }

  /**
   * @param key string
   * @param ttl number
   * @param value string
   */
  static async setex(key, ttl, value) {
    await redisClient.setEx(key, ttl, value);
  }

  /**
   * @param key string
   */
  static async remove(key) {
    await redisClient.del(key);
  }
}
