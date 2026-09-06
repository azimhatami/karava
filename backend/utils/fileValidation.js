const path = require("path");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const DOC_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".zip"]);

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const DOC_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
]);

function getExt(filename = "") {
  return path.extname(String(filename)).toLowerCase();
}

function sniffMimeFromBuffer(buffer) {
  if (!buffer || buffer.length < 4) return null;

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  // WEBP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  // PDF
  if (buffer.toString("ascii", 0, 4) === "%PDF") {
    return "application/pdf";
  }
  // ZIP / DOCX (docx is a zip)
  if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
    return "application/zip";
  }
  // OLE Compound (old .doc)
  if (
    buffer[0] === 0xd0 &&
    buffer[1] === 0xcf &&
    buffer[2] === 0x11 &&
    buffer[3] === 0xe0
  ) {
    return "application/msword";
  }

  return null;
}

function assertAllowedFile({ originalName, claimedMime, buffer, kind }) {
  const ext = getExt(originalName);
  const sniffed = sniffMimeFromBuffer(buffer);

  const allowImages = kind === "portfolio" || kind === "attachment" || kind === "deliverable";
  const allowDocs = kind === "attachment" || kind === "deliverable";

  const allowedExt = new Set([
    ...(allowImages ? IMAGE_EXTENSIONS : []),
    ...(allowDocs ? DOC_EXTENSIONS : []),
  ]);
  const allowedMime = new Set([
    ...(allowImages ? IMAGE_MIME : []),
    ...(allowDocs ? DOC_MIME : []),
  ]);

  if (!allowedExt.has(ext)) {
    const error = new Error("فرمت فایل مجاز نیست");
    error.status = 400;
    throw error;
  }

  // DOC/DOCX/ZIP: sniffed zip is OK for docx/zip; claimed mime must still be in allow list
  const effectiveMime = sniffed || claimedMime;
  if (!effectiveMime || !allowedMime.has(effectiveMime)) {
    // Special-case: .docx sniffed as zip is acceptable
    if (
      !(
        (ext === ".docx" || ext === ".zip") &&
        sniffed === "application/zip" &&
        allowedExt.has(ext)
      )
    ) {
      const error = new Error("نوع واقعی فایل با پسوند آن مطابقت ندارد");
      error.status = 400;
      throw error;
    }
  }

  // Extension vs sniff consistency for images/pdf
  if (sniffed === "image/jpeg" && ![".jpg", ".jpeg"].includes(ext)) {
    const error = new Error("پسوند فایل با محتوای آن سازگار نیست");
    error.status = 400;
    throw error;
  }
  if (sniffed === "image/png" && ext !== ".png") {
    const error = new Error("پسوند فایل با محتوای آن سازگار نیست");
    error.status = 400;
    throw error;
  }
  if (sniffed === "image/webp" && ext !== ".webp") {
    const error = new Error("پسوند فایل با محتوای آن سازگار نیست");
    error.status = 400;
    throw error;
  }
  if (sniffed === "application/pdf" && ext !== ".pdf") {
    const error = new Error("پسوند فایل با محتوای آن سازگار نیست");
    error.status = 400;
    throw error;
  }

  return {
    mimeType:
      ext === ".docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : sniffed || claimedMime,
    ext,
  };
}

function maxBytesForKind(kind) {
  const imageMb = Number(process.env.UPLOAD_MAX_IMAGE_MB || 5);
  const docMb = Number(process.env.UPLOAD_MAX_DOC_MB || 10);
  if (kind === "portfolio") return imageMb * 1024 * 1024;
  return Math.max(imageMb, docMb) * 1024 * 1024;
}

module.exports = {
  IMAGE_EXTENSIONS,
  DOC_EXTENSIONS,
  IMAGE_MIME,
  DOC_MIME,
  sniffMimeFromBuffer,
  assertAllowedFile,
  maxBytesForKind,
  getExt,
};
