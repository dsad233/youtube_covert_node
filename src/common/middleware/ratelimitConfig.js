import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

const ipv6Subnet = 56;

export function ratelimitConfig() {
  return rateLimit({
    windowMs: 5 * 60 * 1000, // 5분 설정
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: ipv6Subnet,
    keyGenerator: (req, _) => {
      if (req.ips[0]) {
        return ipKeyGenerator(req.ips[0], ipv6Subnet);
      }

      return ipKeyGenerator(req.ip, ipv6Subnet);
    },
    validate: {
      ipv6SubnetOrKeyGenerator: true,
    },
    handler: (_, res) => {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: "너무 많은 요청이 발생하였습니다. 잠시 후 다시 시도해 주세요.",
      });
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });
}
