const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createError = require("http-errors");
const path = require("path");
const { allRoutes } = require("./router/router");

// Load .env from backend root regardless of process cwd
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DB_CONNECT_MAX_RETRIES = Number(process.env.DB_CONNECT_MAX_RETRIES || 12);
const DB_CONNECT_RETRY_MS = Number(process.env.DB_CONNECT_RETRY_MS || 5000);

function maskDbUri(uri) {
  if (!uri) return "(undefined)";
  return String(uri).replace(/\/\/([^:@/]+):([^@]+)@/, "//$1:***@");
}

class Application {
  #app = express();
  #PORT = process.env.PORT || 5000;
  #DB_URI = process.env.APP_DB;
  #dbRetryAttempt = 0;
  #dbRetryTimer = null;
  #isConnecting = false;

  constructor() {
    this.createServer();
    this.setupMongooseListeners();
    this.connectToDB();
    this.configServer();
    this.initClientSession();
    this.configRoutes();
    this.errorHandling();
  }

  createServer() {
    this.#app.listen(this.#PORT, () => {
      console.log(`listening on port ${this.#PORT}`);
      console.log(`NODE_ENV=${process.env.NODE_ENV}`);
    });
  }

  setupMongooseListeners() {
    // Prevent unhandled 'error' events from crashing the Node process.
    mongoose.connection.on("error", (err) => {
      console.error(
        "❌ اتصال به دیتابیس برقرار نشد. مطمئن شوید MongoDB روی پورت 27017 در حال اجراست."
      );
      console.error(
        `DB error: ${err?.name || "Error"} — ${err?.message || err}`
      );
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ اتصال MongoDB قطع شد. تلاش برای اتصال مجدد...");
      this.scheduleReconnect();
    });

    mongoose.connection.on("connected", () => {
      this.#dbRetryAttempt = 0;
      console.log("MongoDB connected!!");
    });
  }

  async connectToDB() {
    if (this.#isConnecting) return;
    if (mongoose.connection.readyState === 1) return;

    if (!this.#DB_URI) {
      console.error(
        "❌ متغیر APP_DB در فایل .env تعریف نشده است. مثال: mongodb://127.0.0.1:27017/karava"
      );
      this.scheduleReconnect();
      return;
    }

    this.#isConnecting = true;
    this.#dbRetryAttempt += 1;

    console.log(
      `Connecting to MongoDB (attempt ${this.#dbRetryAttempt}/${DB_CONNECT_MAX_RETRIES}) → ${maskDbUri(
        this.#DB_URI
      )}`
    );

    try {
      // Mongoose 7+ does not need useNewUrlParser / useUnifiedTopology
      await mongoose.connect(this.#DB_URI, {
        serverSelectionTimeoutMS: 5000,
        family: 4, // prefer IPv4 (avoids localhost → ::1 issues with Docker port maps)
      });
    } catch (err) {
      console.error(
        "❌ اتصال به دیتابیس برقرار نشد. مطمئن شوید MongoDB روی پورت 27017 در حال اجراست."
      );
      console.error(`Reason: ${err?.message || err}`);

      if (this.#dbRetryAttempt >= DB_CONNECT_MAX_RETRIES) {
        console.error(
          `⛔ پس از ${DB_CONNECT_MAX_RETRIES} تلاش، اتصال برقرار نشد. سرور HTTP همچنان بالا می‌ماند و دوباره تلاش می‌کند.`
        );
        // Reset counter so we keep retrying slowly instead of crashing.
        this.#dbRetryAttempt = 0;
      }

      this.scheduleReconnect();
    } finally {
      this.#isConnecting = false;
    }
  }

  scheduleReconnect() {
    if (this.#dbRetryTimer) return;
    if (mongoose.connection.readyState === 1) return;

    this.#dbRetryTimer = setTimeout(() => {
      this.#dbRetryTimer = null;
      this.connectToDB();
    }, DB_CONNECT_RETRY_MS);
  }

  getCorsOriginDelegate() {
    const fromEnv = String(process.env.ALLOW_CORS_ORIGIN || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const devOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://[::1]:3000",
    ];

    const allowlist = new Set([
      ...fromEnv,
      ...(process.env.NODE_ENV === "development" ? devOrigins : []),
    ]);

    return (origin, callback) => {
      // curl / same-origin / non-browser clients send no Origin header
      if (!origin || allowlist.has(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    };
  }

  configServer() {
    this.#app.use(
      cors({ credentials: true, origin: this.getCorsOriginDelegate() })
    );
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..")));

    // Ensure local upload folders exist (storage layer is swappable)
    const { ensureUploadRoot } = require("../utils/fileStorage");
    ensureUploadRoot().catch((err) => {
      console.error("Failed to prepare upload directory:", err?.message || err);
    });
  }

  initClientSession() {
    this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }

  configRoutes() {
    this.#app.use("/api", allRoutes);
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("آدرس مورد نظر یافت نشد"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      const payload = {
        statusCode,
        message,
      };

      if (error.code) payload.code = error.code;
      if (error.missingFields) payload.missingFields = error.missingFields;

      return res.status(statusCode).json(payload);
    });
  }
}

module.exports = Application;
