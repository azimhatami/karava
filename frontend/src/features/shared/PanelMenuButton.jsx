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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#006045] bg-white text-[#006045] transition-colors hover:bg-[#E8F3EE] lg:hidden ${className}`}
    >
      <HiOutlineBars3 className="h-6 w-6" />
    </button>
  );
}

export default PanelMenuButton;
