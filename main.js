import express from "express";
import yotubeconvert from "youtube-dl-exec";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { CorsConfig } from "./src/corsConfig.js";
import { fileURLToPath } from "url";
import { StatusCodes } from "http-status-codes";
import { redisClient } from "./src/redisConfig.js";
import { RedisRepository } from "./src/redis/redis.repository.js";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { sleep } from "./src/utils.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CorsConfig());

app.listen(port, () => {
  console.log(port, "서버로 구동 중.");
});

// Youtube MP3로 다운로드
app.post("/mp3/download", async (req, res) => {
  try {
    const { url } = req.query;

    const trim = url.trim();

    if (!trim) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "YouTube URL이 필요합니다." });
    }

    if (
      await RedisRepository.get(
        `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
      )
    ) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: "현재 너무 많은 요청이 있습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    await RedisRepository.setex(
      `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
      60,
      "LOCKED",
    );

    const musicInfos = {};

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(url.trim(), {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("#title > h1 > yt-formatted-string", {
      timeout: 1000,
    });

    const content = await page.content();
    await sleep(600);

    const nowPageUrl = await page.url();
    const urlSlice = nowPageUrl.slice(
      nowPageUrl.indexOf("v=") + 2,
      nowPageUrl.search("&", 1),
    );

    const $ = cheerio.load(content);

    const musicTitle = $("#title > h1 > yt-formatted-string").html();
    const music_artist = $("#text > a").html();

    if (musicTitle && music_artist) {
      musicInfos["title"] = musicTitle;
      musicInfos["artist"] = music_artist;
      musicInfos["image"] = `https://i.ytimg.com/vi/${urlSlice}/hqdefault.jpg`;
    }

    await browser.close();

    const tempName = "tempdownload.mp3";
    const outputName = "download.mp3";

    // 기존 파일 제거 처리
    if (fs.existsSync(outputName)) {
      fs.unlinkSync(outputName);
    } else if (fs.existsSync(tempName)) {
      fs.unlinkSync(tempName);
    }

    const { tempPath, outputPath } = readPath(tempName, outputName);

    console.log("----- convert start -----\n");
    await yotubeconvert(trim, {
      extractAudio: true,
      audioFormat: "mp3",
      output: tempPath,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });
    console.log("\n----- convert end -----");

    console.log("----- processing start -----\n");
    await new Promise((resolve, reject) => {
      const ffmpegCommand = `ffmpeg -i "${tempPath}" -b:a 320k "${outputPath}"`;
      exec(ffmpegCommand, (err, stdout, stderr) => {
        if (err) {
          console.error("변환 오류 발생 : ", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!fs.existsSync(outputPath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "MP3 파일 생성 실패" });
    }

    // 변환 전 파일 삭제
    fs.unlinkSync(tempPath);

    console.log("\n----- processing end -----");
    // 최종 버퍼 파일
    const result = [];
    const mp3File = fs.createReadStream(outputPath, { highWaterMark: 16 });

    if (!mp3File) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "MP3 파일 전송 실패" });
    }

    mp3File.on("data", (chunck) => {
      result.push(chunck);
    });

    mp3File.on("end", () => {
      const concatBuffer = Buffer.concat(result);
      return res.status(StatusCodes.OK).json({
        message: "MP3 파일로 변환 성공!",
        data: musicInfos,
        buffer: JSON.stringify(concatBuffer.toString("base64")),
      });
    });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "MP3로 변환 실패" });
  } finally {
    await RedisRepository.remove(
      `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
    );
  }
});

// Youtube MP4로 다운로드
app.post("/mp4/download", async (req, res) => {
  try {
    const { url } = req.query;

    const trim = url.trim();

    if (!trim) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "YouTube URL이 필요합니다." });
    }

    if (
      await RedisRepository.get(
        `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
      )
    ) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: "현재 너무 많은 요청이 있습니다. 잠시 후 다시 시도해 주세요.",
      });
    }

    await RedisRepository.setex(
      `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
      60,
      "LOCKED",
    );

    const musicInfos = {};

    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.goto(url.trim(), {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("#title > h1 > yt-formatted-string", {
      timeout: 1000,
    });

    const content = await page.content();
    await sleep(600);

    const nowPageUrl = await page.url();
    const urlSlice = nowPageUrl.slice(
      nowPageUrl.indexOf("v=") + 2,
      nowPageUrl.search("&", 1),
    );

    const $ = cheerio.load(content);

    const musicTitle = $("#title > h1 > yt-formatted-string").html();
    const music_artist = $("#text > a").html();

    if (musicTitle && music_artist) {
      musicInfos["title"] = musicTitle;
      musicInfos["artist"] = music_artist;
      musicInfos["image"] = `https://i.ytimg.com/vi/${urlSlice}/hqdefault.jpg`;
    }

    await browser.close();

    const tempName = "tempdownload.webm.mkv.webm";
    const outputName = "download.mp4";

    // 기존 파일 제거 처리
    if (fs.existsSync(outputName)) {
      fs.unlinkSync(outputName);
    } else if (fs.existsSync(tempName)) {
      fs.unlinkSync(tempName);
    }

    const { tempPath, outputPath } = readPath(tempName, outputName);

    console.log("----- convert start -----\n");
    await yotubeconvert(trim, {
      format: "bestvideo[height<=1080]+bestaudio/best",
      output: tempPath,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    }).then((output) => console.log(output));
    console.log("\n----- convert end -----");

    console.log("----- processing start -----\n");
    await new Promise((resolve, reject) => {
      const ffmpegCommand = `ffmpeg -i "${tempPath}" -c:v libx264 -c:a aac -strict experimental -b:a 320k "${outputPath}"`;
      exec(ffmpegCommand, (err, stdout, stderr) => {
        if (err) {
          console.error("변환 오류 발생 : ", err);
          reject(err);
        } else {
          console.log("변환 성공 : ", stdout || stderr);
          resolve();
        }
      });
    });

    if (!fs.existsSync(outputPath)) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "MP4 파일 생성 실패" });
    }

    // 변환 전 파일 삭제
    fs.unlinkSync(tempPath);

    console.log("\n----- processing end -----");

    const result = [];
    const mp4File = fs.createReadStream(outputPath, { highWaterMark: 16 });

    if (!mp4File) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "MP4 파일 전송 실패" });
    }

    mp4File.on("data", (chunck) => {
      result.push(chunck);
    });

    mp4File.on("end", () => {
      const concatBuffer = Buffer.concat(result);
      return res.status(StatusCodes.OK).json({
        message: "MP4 파일로 변환 성공!",
        data: musicInfos,
        buffer: JSON.stringify(concatBuffer.toString("base64")),
      });
    });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "MP4로 변환 실패" });
  } finally {
    await RedisRepository.remove(
      `SESSION:userIp=${req.ip.trim() || req.ips[0].trim()}`,
    );
  }
});

// 파일 경로 read
function readPath(tempName, outputName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const tempPath = path.resolve(__dirname, tempName.trim());
  const outputPath = outputName
    ? path.resolve(__dirname, outputName.trim())
    : null;

  return { tempPath, outputPath };
}
