import { useRef, useState } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineTrash, HiOutlineDocument } from 'react-icons/hi2';
import {
  formatFileSize,
  isImageFileMeta,
  resolveFileUrl,
  validateUploadFile,
} from '../utils/uploadValidation';
import Loading from './Loading';

function FileUploadField({
  kind = 'attachment',
  label = 'آپلود فایل',
  hint,
  accept,
  multiple = false,
  onUpload,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localError, setLocalError] = useState('');

  const resolvedAccept =
    accept ||
    (kind === 'portfolio'
      ? 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'
      : 'image/jpeg,image/png,image/webp,application/pdf,.doc,.docx,application/zip,.jpg,.jpeg,.png,.webp,.pdf,.zip');

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || !onUpload) return;

    setLocalError('');
    const file = files[0];
    const validationError = validateUploadFile(file, kind);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      setLocalError(
        error?.response?.data?.message || error?.message || 'آپلود ناموفق بود',
      );
      throw error;
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="karava-form-field">
      {label ? <label className="karava-form-label">{label}</label> : null}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled && !isUploading) {
            handleFiles(event.dataTransfer.files).catch(() => {});
          }
        }}
        className={`flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed p-4 text-center transition-colors ${
          isDragging
            ? 'border-[#006045] bg-[#F2FFF8]'
            : 'border-[#9CA3AF] bg-[#F9FAFB]'
        } ${disabled || isUploading ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => {
          if (!disabled && !isUploading) inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!disabled && !isUploading) inputRef.current?.click();
          }
        }}
      >
        {isUploading ? (
          <Loading />
        ) : (
          <>
            <HiOutlineCloudArrowUp className="h-8 w-8 text-[#006045]" />
            <p className="text-sm font-bold text-[#222020]">
              فایل را بکشید و رها کنید یا کلیک کنید
            </p>
            {hint ? <p className="text-xs text-[#6E6E6E]">{hint}</p> : null}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={resolvedAccept}
          multiple={multiple}
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(event) => {
            handleFiles(event.target.files).catch(() => {});
          }}
        />
      </div>
      {localError ? (
        <span className="mt-1 block text-right text-xs text-karava-red">
          {localError}
        </span>
      ) : null}
    </div>
  );
}

export function FileList({
  files = [],
  onDelete,
  canDelete = false,
  emptyText = 'فایلی موجود نیست',
  showThumbnails = true,
}) {
  if (!files.length) {
    return <p className="text-sm text-[#6E6E6E]">{emptyText}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => {
        const url = resolveFileUrl(file.url);
        const image = showThumbnails && isImageFileMeta(file);

        return (
          <li
            key={file._id || file.storageKey || file.url}
            className="overflow-hidden rounded-[10px] border border-[#D1D5DB] bg-white"
          >
            {image ? (
              <a href={url} target="_blank" rel="noreferrer" className="block">
                <img
                  src={url}
                  alt={file.originalName || 'file'}
                  className="h-36 w-full object-cover"
                />
              </a>
            ) : (
              <div className="flex h-28 items-center justify-center bg-[#F3F4F6] text-[#006045]">
                <HiOutlineDocument className="h-10 w-10" />
              </div>
            )}
            <div className="flex items-start justify-between gap-2 p-3">
              <div className="min-w-0 text-right">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block truncate text-sm font-bold text-[#006045] hover:underline"
                  title={file.originalName}
                >
                  {file.originalName || 'فایل'}
                </a>
                <p className="mt-1 text-xs text-[#6E6E6E]">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {canDelete && onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(file)}
                  className="rounded-[6px] p-1.5 text-[#BE185D] hover:bg-[#FFF1F2]"
                  aria-label="حذف فایل"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FileUploadField;
