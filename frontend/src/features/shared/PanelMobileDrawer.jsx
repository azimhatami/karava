import { NavLink } from 'react-router-dom';
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckBadge,
  HiOutlineXMark,
} from 'react-icons/hi2';
import useLogout from '../authentication/useLogout';
import { usePanelNav } from './PanelNavContext';

function DrawerNavItem({ to, label, icon: Icon, badge, end, onNavigate }) {
  return (
    <NavLink to={to} end={end} onClick={onNavigate} className="block w-full">
      {({ isActive }) => (
        <div
          className={`flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-3 transition-colors ${
            isActive ? 'bg-[#245A49] text-white' : 'text-[#222020] hover:bg-[#E8F3EE]'
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Icon
              className={`h-5 w-5 shrink-0 ${
                isActive ? 'text-white' : 'text-[#006045]'
              }`}
            />
            <span className="truncate text-sm font-bold">{label}</span>
          </div>
          {badge != null && badge > 0 ? (
            <span
              className={`inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isActive
                  ? 'bg-[#008F66] text-[#245A49]'
                  : 'bg-[#C9093D] text-white'
              }`}
            >
              {badge}
            </span>
          ) : null}
        </div>
      )}
    </NavLink>
  );
}

function PanelMobileDrawer() {
  const { roleLabel, navItems, isDrawerOpen, closeDrawer } = usePanelNav();
  const { logout, isPending } = useLogout();

  return (
    <div
      className="lg:hidden"
      aria-hidden={!isDrawerOpen}
    >
      <button
        type="button"
        aria-label="بستن منو"
        tabIndex={isDrawerOpen ? 0 : -1}
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300 ${
          isDrawerOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="منوی پنل"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(320px,88vw)] flex-col border-l border-[#006045] bg-white shadow-xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] p-4">
          <div className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-[12px] border border-[#0E6A50] bg-white p-2">
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold text-[#222020]">
                {roleLabel?.name || 'کاربر'}
              </p>
              <p className="mt-1 truncate text-sm text-[#222020]">
                {roleLabel?.title || ''}
              </p>
            </div>
            <HiOutlineCheckBadge className="h-5 w-5 shrink-0 text-karava-green-dark" />
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="بستن"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#D1D5DB] text-[#222020] hover:bg-karava-bg-subtle"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <DrawerNavItem
              key={item.to}
              {...item}
              onNavigate={closeDrawer}
            />
          ))}
        </nav>

        <div className="border-t border-[#E5E7EB] p-3">
          <button
            type="button"
            onClick={() => {
              closeDrawer();
              logout();
            }}
            disabled={isPending}
            className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg border border-[#FF2020] bg-white text-xs text-[#FF2020] transition-colors hover:bg-karava-bg-subtle disabled:opacity-60"
          >
            <span>خروج از سیستم</span>
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </div>
  );
}

export default PanelMobileDrawer;
