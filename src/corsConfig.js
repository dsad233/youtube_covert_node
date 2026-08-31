import cors from "cors";
import { SERVER_URL } from "./common/keys.js";

export function CorsConfig() {
  return cors({
    origin: [SERVER_URL],
    credential: true,
  });
}
