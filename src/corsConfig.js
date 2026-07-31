import cors from "cors";

export function CorsConfig() {
  return cors({
    origin: ["http://localhost:5173"],
    credential: true,
  });
}
