import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineXMark,
} from 'react-icons/hi2';
import useLogout from '../authentication/useLogout';
import { usePanelNav } from './PanelNavContext';
import { PanelNavItem } from './PanelSidebar';

function PanelMobileDrawer() {
  const { roleLabel, navItems, isDrawerOpen, closeDrawer } = usePanelNav();
  const { logout, isPending } = useLogout();

  return (
    <div className="lg:hidden" aria-hidden={!isDrawerOpen}>
      <button
        type="button"
        aria-label="بستن منو"
        tabIndex={isDrawerOpen ? 0 : -1}
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isDrawerOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="منوی پنل"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(320px,88vw)] flex-col bg-ink shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-mint text-[15px] font-bold text-ink">
              {(roleLabel?.name || 'ک').trim().charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#F2F6F4]">
                {roleLabel?.name || 'کاربر'}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-dim">
                {roleLabel?.title || ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="بستن"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 text-ink-dim transition-colors hover:bg-white/5 hover:text-[#F2F6F4]"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <PanelNavItem key={item.to} {...item} onNavigate={closeDrawer} />
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              closeDrawer();
              logout();
            }}
            disabled={isPending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 text-[13px] text-ink-dim transition-colors hover:border-[#C9093D]/40 hover:bg-[#C9093D]/10 hover:text-[#FF8DA8] disabled:opacity-60"
          >
            خروج از سیستم
            <HiOutlineArrowRightOnRectangle className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>
    </div>
  );
}

export default PanelMobileDrawer;
