import cors from "cors";
import { SERVER_URL } from "../keys.js";

export function CorsConfig() {
  return cors({
    origin: [SERVER_URL],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credential: true,
  });
}
