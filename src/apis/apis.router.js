import express from "express";

import { Wrapper } from "../common/wrapper.js";

import { RedisRepository } from "../redis/redis.repository.js";
import { ApisController } from "../apis/apis.controller.js";

const router = express.Router();

const apisController = new ApisController(new RedisRepository());

// Youtube MP3로 다운로드
router.post("/mp3/download", Wrapper(apisController.mp3Download));

// Youtube MP4로 다운로드
router.post("/mp4/download", Wrapper(apisController.mp4Download));

export default router;
