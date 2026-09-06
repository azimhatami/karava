import { HiOutlinePaperClip, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { FileList } from './FileUploadField';
import { formatFileSize, resolveFileUrl, isImageFileMeta } from '../utils/uploadValidation';

/**
 * Compact attachment chips for tables / headers.
 */
export function AttachmentChips({ files = [], className = '' }) {
  if (!files?.length) return null;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 ${className}`}>
      {files.map((file) => (
        <a
          key={file._id || file.url}
          href={resolveFileUrl(file.url)}
          target="_blank"
          rel="noreferrer"
          title={file.originalName}
          className="inline-flex max-w-[140px] items-center gap-1 truncate rounded-[6px] border border-[#006045] bg-[#F2FFF8] px-2 py-1 text-[11px] font-bold text-[#006045] hover:bg-[#E6F4EC]"
        >
          <HiOutlinePaperClip className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{file.originalName}</span>
        </a>
      ))}
    </div>
  );
}

/**
 * Full attachment section for project details / owner project page.
 */
function ProjectAttachmentsSection({
  files = [],
  title = 'ضمائم پروژه',
  emptyText = 'ضمیمه‌ای ثبت نشده است',
  requireAuth = false,
  isAuthenticated = true,
  onRequireAuth,
}) {
  return (
    <div className="space-y-3 text-right">
      <div className="flex items-center gap-2">
        <HiOutlinePaperClip className="h-4 w-4 text-[#006045]" />
        <h2 className="text-sm font-bold text-[#222020]">{title}</h2>
      </div>

      {!files?.length ? (
        <p className="text-sm text-[#6E6E6E]">{emptyText}</p>
      ) : requireAuth && !isAuthenticated ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file._id || file.url}>
              <button
                type="button"
                onClick={onRequireAuth}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6E6E6E]"
              >
                برای دانلود وارد شوید — {file.originalName}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => {
            const url = resolveFileUrl(file.url);
            const image = isImageFileMeta(file);
            return (
              <li
                key={file._id || file.url}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#D1D5DB] bg-[#F9FAFB] p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {image ? (
                    <a href={url} target="_blank" rel="noreferrer">
                      <img
                        src={url}
                        alt={file.originalName}
                        className="h-14 w-14 rounded-[8px] object-cover"
                      />
                    </a>
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#E8F3EE] text-[#006045]">
                      <HiOutlinePaperClip className="h-6 w-6" />
                    </span>
                  )}
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-bold text-[#222020]">
                      {file.originalName}
                    </p>
                    <p className="mt-1 text-xs text-[#6E6E6E]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#006045] bg-white px-3 py-2 text-xs font-bold text-[#006045] hover:bg-[#F2FFF8]"
                >
                  <HiOutlineArrowDownTray className="h-4 w-4" />
                  دانلود / مشاهده
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export { FileList };
export default ProjectAttachmentsSection;
