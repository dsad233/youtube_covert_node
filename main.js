import express from "express";
import helmet from "helmet";

import ApiRouter from "./src/apis/apis.router.js";
import { LISTENING_PORT, NODE_ENV } from "./src/common/keys.js";

import { CorsConfig } from "./src/corsConfig.js";
import { EnvironmentEnv } from "./src/utils.js";
import { ErrorMiddleware } from "./src/common/middleware/errorMiddleware.js";

const app = express();
const port = LISTENING_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CorsConfig());

if (NODE_ENV === EnvironmentEnv.PROD) {
  app.use(helmet());
}

app.use("/api", ApiRouter);

app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(port, "서버로 구동 중.");
});

process.on("SIGINT", () => {
  console.log("애플리케이션 종료.");
  process.exit(1);
});
