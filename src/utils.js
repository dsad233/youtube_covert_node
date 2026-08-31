import { fileURLToPath } from "url";
import path from "path";

export const EnvironmentEnv = {
  PROD: "prod",
  DEV: "DEV",
  LOCAL: "LOCAL",
};

export function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// 파일 경로 read
export function readPath(tempName, outputName) {
  const tempPath = process.cwd() + "/" + tempName;
  const outputPath = outputName ? process.cwd() + "/" + outputName : null;

  return { tempPath, outputPath };
}
