import express from "express";
import helmet from "helmet";

import ApiRouter from "./src/apis/apis.router.js";
import { LISTENING_PORT, NODE_ENV } from "./src/common/keys.js";

import { CorsConfig } from "./src/common/middleware/corsConfig.js";
import { EnvironmentEnv } from "./src/utils.js";
import { ErrorMiddleware } from "./src/common/middleware/errorMiddleware.js";
import { ratelimitConfig } from "./src/common/middleware/ratelimitConfig.js";

const app = express();
const port = LISTENING_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CorsConfig());

if (NODE_ENV === EnvironmentEnv.PROD) {
  // http 보호 미들웨어 설정
  app.use(helmet());
  // ratelimit 설정
  app.use(ratelimitConfig());
}

app.use("/api", ApiRouter);

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(port, "서버로 구동 중...");
});

process.on("SIGINT", () => {
  console.log("애플리케이션 종료.");
  process.exit(1);
});
