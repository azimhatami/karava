const multer = require("multer");
const createHttpError = require("http-errors");
const { maxBytesForKind } = require("../../../utils/fileValidation");

const memoryStorage = multer.memoryStorage();

function createUploader(kind) {
  const maxBytes = maxBytesForKind(kind);

  return multer({
    storage: memoryStorage,
    limits: {
      fileSize: maxBytes,
      files: 1,
    },
  }).single("file");
}

function handleMulterUpload(kind) {
  const upload = createUploader(kind);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(
            createHttpError.BadRequest(
              kind === "portfolio"
                ? "حجم تصویر نباید بیشتر از حد مجاز باشد"
                : "حجم فایل نباید بیشتر از حد مجاز باشد"
            )
          );
        }
        return next(createHttpError.BadRequest("آپلود فایل نامعتبر است"));
      }

      return next(err);
    });
  };
}

/** Simple in-memory rate limiter for upload endpoints. */
function uploadRateLimit(options = {}) {
  const windowMs = Number(
    options.windowMs || process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000
  );
  const max = Number(options.max || process.env.UPLOAD_RATE_LIMIT_MAX || 30);
  const hits = new Map();

  return (req, res, next) => {
    const key = String(req.user?._id || req.ip || "anonymous");
    const now = Date.now();
    const bucket = hits.get(key) || [];
    const recent = bucket.filter((ts) => now - ts < windowMs);
    recent.push(now);
    hits.set(key, recent);

    if (recent.length > max) {
      return next(
        createHttpError.TooManyRequests(
          "تعداد درخواست‌های آپلود بیش از حد مجاز است. کمی بعد دوباره تلاش کنید."
        )
      );
    }

    return next();
  };
}

module.exports = {
  handleMulterUpload,
  uploadRateLimit,
};
