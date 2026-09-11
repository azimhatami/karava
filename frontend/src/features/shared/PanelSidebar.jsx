import { NavLink } from 'react-router-dom';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import useLogout from '../authentication/useLogout';
import { usePanelNav } from './PanelNavContext';
import { toPersianNumbers } from '../../utils/toPersianNumbers';

export function PanelNavItem({ to, label, icon: Icon, badge, end, onNavigate }) {
  return (
    <NavLink to={to} end={end} onClick={onNavigate} className="block w-full">
      {({ isActive }) => (
        <div
          className={`group flex h-11 w-full items-center justify-between gap-2.5 rounded-[10px] px-3.5 transition-colors ${
            isActive
              ? 'bg-ink-raised text-[#F2F6F4]'
              : 'text-ink-dim hover:bg-ink-raised/60 hover:text-[#F2F6F4]'
          }`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Icon
              className={`h-[18px] w-[18px] shrink-0 ${
                isActive ? 'text-ink-mint' : 'text-ink-dim group-hover:text-ink-mint'
              }`}
            />
            <span
              className={`truncate text-sm ${isActive ? 'font-bold' : 'font-normal'}`}
            >
              {label}
            </span>
          </span>

          {badge != null && badge > 0 ? (
            <span
              className={`flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full px-1.5 text-[11.5px] font-bold ${
                isActive
                  ? 'bg-ink-mint text-ink'
                  : 'bg-white/10 text-ink-dim group-hover:bg-ink-mint group-hover:text-ink'
              }`}
            >
              {toPersianNumbers(badge)}
            </span>
          ) : null}
        </div>
      )}
    </NavLink>
  );
}

/** Desktop sidebar only — mobile uses PanelMobileDrawer via PanelNavProvider. */
function PanelSidebar() {
  const { roleLabel, navItems } = usePanelNav();
  const { logout, isPending } = useLogout();

  return (
    <aside className="sticky top-6 hidden w-[248px] shrink-0 flex-col gap-7 self-start rounded-2xl bg-ink p-4 lg:flex">
      <div className="flex items-center gap-3 px-1 pt-1">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-mint text-[15px] font-bold text-ink">
          {(roleLabel?.name || 'ک').trim().charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-[#F2F6F4]">
            {roleLabel?.name || 'کاربر'}
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-dim">
            {roleLabel?.title || ''}
          </span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <PanelNavItem key={item.to} {...item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        disabled={isPending}
        className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 text-[13px] text-ink-dim transition-colors hover:border-[#C9093D]/40 hover:bg-[#C9093D]/10 hover:text-[#FF8DA8] disabled:opacity-60"
      >
        خروج از سیستم
        <HiOutlineArrowRightOnRectangle className="h-[18px] w-[18px]" />
      </button>
    </aside>
  );
}

export default PanelSidebar;
