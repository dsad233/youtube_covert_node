import { StatusCodes } from "http-status-codes";

export async function ErrorMiddleware(err, req, res, next) {
  if (err.status === StatusCodes.INTERNAL_SERVER_ERROR) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 에러가 발생하였습니다.",
    });
  }

  return res.status(err.status).json({
    message: err.message,
  });
}
