import { HiOutlineBars3 } from 'react-icons/hi2';
import { usePanelNav } from './PanelNavContext';

function PanelMenuButton({ className = '' }) {
  const { openDrawer, isDrawerOpen } = usePanelNav();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="باز کردن منو"
      aria-expanded={isDrawerOpen}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-ink-line text-ink-text transition-colors hover:bg-ink-well lg:hidden ${className}`}
    >
      <HiOutlineBars3 className="h-5 w-5" />
    </button>
  );
}

export default PanelMenuButton;
