import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { WHITELIST_DOMAIN } from "~/utils/constants";

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // cân phải check thêm đang ở môi trường dev nữa
      return callback(null, true);
    }
    if (WHITELIST_DOMAIN.includes(origin)) {
      return callback(null, true);
    }
    return callback(new ApiError(StatusCodes.FORBIDDEN, "Not allowed by CORS"));
  },
  optionsSuccessStatus: 200, // Một số browser cũ không support 204
  credentials: true, // cho phép gửi cookie từ client lên server
};
