const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
];

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const DOC_EXTS = ['.pdf', '.doc', '.docx', '.zip'];

const DEFAULT_IMAGE_MAX_MB = 5;
const DEFAULT_DOC_MAX_MB = 10;

function getExtension(filename = '') {
  const idx = String(filename).lastIndexOf('.');
  if (idx < 0) return '';
  return String(filename).slice(idx).toLowerCase();
}

/**
 * Client-side file validation before upload.
 * @param {'portfolio'|'attachment'|'deliverable'} kind
 */
export function validateUploadFile(file, kind = 'attachment', options = {}) {
  if (!file) return 'فایلی انتخاب نشده است';

  const imageMaxMb = options.imageMaxMb ?? DEFAULT_IMAGE_MAX_MB;
  const docMaxMb = options.docMaxMb ?? DEFAULT_DOC_MAX_MB;
  const ext = getExtension(file.name);
  const isImage = IMAGE_TYPES.includes(file.type) || IMAGE_EXTS.includes(ext);
  const isDoc = DOC_TYPES.includes(file.type) || DOC_EXTS.includes(ext);

  if (kind === 'portfolio') {
    if (!isImage || !IMAGE_EXTS.includes(ext)) {
      return 'فقط تصاویر jpg، png یا webp مجاز هستند';
    }
    if (file.size > imageMaxMb * 1024 * 1024) {
      return `حداکثر حجم تصویر ${imageMaxMb} مگابایت است`;
    }
    return null;
  }

  if (!isImage && !isDoc) {
    return 'فرمت فایل مجاز نیست (تصویر، pdf، doc، docx یا zip)';
  }

  const maxMb = isImage ? imageMaxMb : docMaxMb;
  if (file.size > maxMb * 1024 * 1024) {
    return `حداکثر حجم فایل ${maxMb} مگابایت است`;
  }

  return null;
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function resolveFileUrl(urlOrPath) {
  if (!urlOrPath) return '';
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;

  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const origin = base.replace(/\/api\/?$/, '');
  return `${origin}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
}

export function isImageFileMeta(file) {
  const mime = file?.mimeType || '';
  const name = file?.originalName || file?.filename || '';
  return (
    mime.startsWith('image/') ||
    IMAGE_EXTS.includes(getExtension(name))
  );
}
