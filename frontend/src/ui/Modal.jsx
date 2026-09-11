import { createPortal } from 'react-dom';
import { HiOutlineXMark } from 'react-icons/hi2';
import useOutsideClick from '../hooks/useOutsideClick';

function Modal({ open, onClose, title, children }) {
  const ref = useOutsideClick(onClose, true, open);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div
        ref={ref}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-ink-line bg-ink-card shadow-[0_24px_60px_rgba(7,20,17,0.28)]"
      >
        <div className="relative shrink-0 border-b border-ink-hair px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute left-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
          <h2 className="pl-10 text-right text-[16px] font-bold text-ink-text">
            {title}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
