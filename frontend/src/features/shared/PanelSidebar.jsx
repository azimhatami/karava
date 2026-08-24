import { NavLink } from 'react-router-dom';
import { HiCheckBadge, HiArrowRightOnRectangle } from 'react-icons/hi2';
import useLogout from '../authentication/useLogout';
import karava from '../../theme/karava';

function SidebarNavItem({ to, label, icon: Icon, badge, badgeColor = '#A9A9A9', end }) {
  return (
    <NavLink to={to} end={end} className="block w-full">
      {({ isActive }) => (
        <div
          className={`flex h-[31px] w-full items-center justify-between rounded-[6px] px-1.5 py-1.5 ${
            isActive ? 'bg-karava-green-dark' : ''
          }`}
        >
          <div className="flex items-center gap-1">
            <Icon
              className={`h-[19px] w-[19px] shrink-0 ${
                isActive ? 'text-karava-bg-subtle' : 'text-karava-text'
              }`}
            />
            <span
              className={`text-base leading-[19px] ${
                isActive ? 'text-karava-bg-subtle' : 'text-karava-text'
              }`}
            >
              {label}
            </span>
          </div>

          {badge != null && badge > 0 ? (
            <span
              className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: isActive ? karava.greenLight : badgeColor }}
            >
              {badge}
            </span>
          ) : null}
        </div>
      )}
    </NavLink>
  );
}

function PanelSidebar({ roleLabel, navItems }) {
  const { logout, isPending } = useLogout();

  return (
    <aside className="sticky top-[88px] z-10 flex h-[998px] max-h-[calc(100vh-96px)] w-[288px] shrink-0 self-start flex-col items-center gap-[25px] overflow-x-hidden overflow-y-auto rounded-[6px] border border-karava-green bg-white p-3">
      <div className="flex h-[61px] w-full items-start justify-between gap-4 self-stretch rounded-[12px] border border-karava-green-dark p-2">
        <div className="flex flex-1 flex-col items-end gap-[5px] text-right">
          <span className="w-full text-right text-base font-normal leading-[19px] text-karava-text">
            {roleLabel.name}
          </span>
          <span className="w-full text-right text-base font-normal leading-[19px] text-karava-text">
            {roleLabel.title}
          </span>
        </div>
        <HiCheckBadge className="h-5 w-5 shrink-0 text-karava-green-dark" />
      </div>

      <nav className="flex w-full flex-1 flex-col gap-[21px] self-stretch">
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        disabled={isPending}
        className="flex h-[46px] w-full shrink-0 items-center justify-center gap-2.5 rounded-lg border border-karava-red bg-white p-2.5 text-xs leading-[15px] text-karava-red transition-colors hover:bg-karava-bg-subtle disabled:opacity-60"
      >
        <span>خروج از سیستم</span>
        <HiArrowRightOnRectangle className="h-6 w-6 shrink-0" />
      </button>
    </aside>
  );
}

export default PanelSidebar;
