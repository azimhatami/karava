import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';
import useOutsideClick from '../hooks/useOutsideClick';

function Modal({ open, onClose, title, children }) {
  const ref = useOutsideClick(onClose, true, open);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-karava-text/30 p-4 backdrop-blur-sm">
      <div
        ref={ref}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[640px] flex-col overflow-hidden rounded-[6px] border border-[#D1D5DB] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
      >
        <div className="relative shrink-0 px-6 pb-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute left-6 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-karava-green text-karava-green transition-colors hover:bg-karava-bg-subtle"
          >
            <HiOutlineX className="h-3.5 w-3.5" />
          </button>
          <h2 className="pr-8 text-right text-base font-bold leading-[19px] text-karava-text">
            {title}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
