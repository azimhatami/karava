const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");

const UPLOAD_ROOT = path.resolve(
  __dirname,
  "..",
  process.env.UPLOAD_DIR || "uploads"
);

const ALLOWED_FOLDERS = new Set(["portfolio", "attachments", "deliverables"]);

function ensureSafeRelativeKey(storageKey) {
  const normalized = String(storageKey || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  if (!normalized || normalized.includes("..") || path.isAbsolute(normalized)) {
    const error = new Error("مسیر فایل نامعتبر است");
    error.status = 400;
    throw error;
  }

  const [folder] = normalized.split("/");
  if (!ALLOWED_FOLDERS.has(folder)) {
    const error = new Error("پوشه فایل نامعتبر است");
    error.status = 400;
    throw error;
  }

  const absolute = path.resolve(UPLOAD_ROOT, normalized);
  if (!absolute.startsWith(UPLOAD_ROOT + path.sep) && absolute !== UPLOAD_ROOT) {
    const error = new Error("مسیر فایل خارج از محدوده مجاز است");
    error.status = 400;
    throw error;
  }

  return { relativeKey: normalized, absolutePath: absolute };
}

async function ensureUploadRoot() {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  for (const folder of ALLOWED_FOLDERS) {
    await fs.mkdir(path.join(UPLOAD_ROOT, folder), { recursive: true });
  }
}

function buildStoredFilename(originalName) {
  const ext = path.extname(originalName || "").toLowerCase().slice(0, 10);
  const safeExt = /^\.[a-z0-9]+$/.test(ext) ? ext : "";
  return `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
}

/**
 * Local disk storage implementation.
 * Swap this module later for S3/Arvan without changing controllers.
 */
async function saveFile({ folder, originalName, buffer, mimeType }) {
  if (!ALLOWED_FOLDERS.has(folder)) {
    const error = new Error("پوشه آپلود نامعتبر است");
    error.status = 400;
    throw error;
  }

  await ensureUploadRoot();

  const filename = buildStoredFilename(originalName);
  const relativeKey = `${folder}/${filename}`;
  const { absolutePath } = ensureSafeRelativeKey(relativeKey);

  await fs.writeFile(absolutePath, buffer);

  return {
    filename,
    originalName: String(originalName || filename).slice(0, 255),
    mimeType: mimeType || "application/octet-stream",
    size: buffer.length,
    storageKey: relativeKey,
    url: `/api/files/${relativeKey}`,
    uploadedAt: new Date(),
  };
}

async function deleteFile(storageKey) {
  if (!storageKey) return;
  const { absolutePath } = ensureSafeRelativeKey(storageKey);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function getFileStreamPath(storageKey) {
  const { absolutePath, relativeKey } = ensureSafeRelativeKey(storageKey);
  await fs.access(absolutePath);
  return { absolutePath, relativeKey };
}

function getPublicUrl(storageKey) {
  if (!storageKey) return null;
  const { relativeKey } = ensureSafeRelativeKey(storageKey);
  return `/api/files/${relativeKey}`;
}

module.exports = {
  UPLOAD_ROOT,
  ensureUploadRoot,
  saveFile,
  deleteFile,
  getFileStreamPath,
  getPublicUrl,
  ensureSafeRelativeKey,
};
