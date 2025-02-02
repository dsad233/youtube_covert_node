import express from "express";
import yotubeconvert from "youtube-dl-exec";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { exec } from "child_process";
import cors from "cors";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors({
    origin: ['http://localhost:3111'],
    credential : true
}));

app.listen(port, () => {
    console.log(port, "서버로 구동 중.");
});


// Youtube MP3로 다운로드
app.get('/mp3/download', async (req, res) => {
    try {
        const { youtubeUrl } = req.query;

        if (!youtubeUrl) {
            return res.status(400).json({ message: 'YouTube URL이 필요합니다.' });
        }

        const tempName = "tempdownload.mp3";
        const outputName = "download.mp3"
        
        const tempPath = path.resolve(process.env.DOWNLOAD_PATH, tempName);
        const outputPath = path.resolve(process.env.DOWNLOAD_PATH, outputName);


        console.log("----- convert start -----\n");
        await yotubeconvert(youtubeUrl, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: tempPath,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
          }).then(output => console.log(output));
        console.log("\n----- convert end -----");

          
        console.log("----- processing start -----\n");
        await new Promise((resolve, reject) => {
            const ffmpegCommand = `ffmpeg -i "${tempPath}" -b:a 320k "${outputPath}"`;
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
            return res.status(500).json({ message: 'MP3 파일 생성 실패' });
        }

        fs.unlinkSync(tempPath);
        
        console.log("\n----- processing end -----");
        return res.status(201).json({ message : "MP3 파일로 변환 성공!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message : "MP3로 변환 실패" });
    }
});


// Youtube MP4로 다운로드
app.get('/mp4/download', async (req, res) => {
    try {
        const { youtubeUrl } = req.query;
        
        if (!youtubeUrl) {
            return res.status(400).json({ message: 'YouTube URL이 필요합니다.' });
        }

        const tempName = "tempdownload.webm"
        const outputName = "download.mp4";
        
        const tempPath = path.resolve(process.env.DOWNLOAD_PATH, tempName);
        const outputPath = path.resolve(process.env.DOWNLOAD_PATH, outputName);


        console.log("----- convert start -----\n");
        await yotubeconvert(youtubeUrl, {
            format: 'bestvideo[height<=1080]+bestaudio/best',
            output: tempPath,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            addHeader: ['referer:youtube.com', 'user-agent:googlebot']
          }).then(output => console.log(output));
        console.log("\n----- convert end -----");


        console.log("----- processing start -----\n");
        await new Promise((resolve, reject) => {
            const ffmpegCommand = `ffmpeg -i "${tempPath}" -c:v libx264 -c:a aac -strict experimental -b:a 320k "${outputPath}"`;
            exec(ffmpegCommand, (err, stdout, stderr) => {
                if(err){
                    console.error("변환 오류 발생 : ", err);
                    reject(err);
                } else {
                    console.log("변환 성공 : ", stdout || stderr);
                    resolve();
                }
            });
        });

        if (!fs.existsSync(outputPath)) {
            return res.status(500).json({ message: 'MP4 파일 생성 실패' });
        }

        fs.unlinkSync(tempPath);

        console.log("\n----- processing end -----");
        return res.status(201).json({ message : "MP4 파일로 변환 성공!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message : "MP4로 변환 실패" });
    }
});
