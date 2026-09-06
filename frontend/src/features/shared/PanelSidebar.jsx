import { NavLink } from 'react-router-dom';
import { HiOutlineCheckBadge, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import useLogout from '../authentication/useLogout';

function SidebarNavItem({ to, label, icon: Icon, badge, end }) {
  return (
    <NavLink to={to} end={end} className="block w-full">
      {({ isActive }) => (
        <div
          className={`group flex h-[31px] w-[238px] rotate-0 items-center justify-between gap-2.5 rounded-[6px] p-1.5 opacity-100 ${
            isActive ? 'bg-[#245A49]' : 'hover:bg-[#245A49]'
          }`}
        >
          <div className="flex items-center gap-1">
            <Icon
              className={`h-[19px] w-[19px] shrink-0 ${
                isActive
                  ? 'text-[#F8F9FD]'
                  : 'text-karava-text group-hover:text-[#F8F9FD]'
              }`}
            />
            <span
              className={`h-[19px] w-[134px] rotate-0 text-right font-['Inter'] text-base font-normal leading-none tracking-normal opacity-100 ${
                isActive
                  ? 'text-[#F8F9FD]'
                  : 'text-karava-text group-hover:text-[#F8F9FD]'
              }`}
            >
              {label}
            </span>
          </div>

          {badge != null && badge > 0 ? (
            <span
              className={`relative flex h-[15.83px] w-[15.83px] shrink-0 rotate-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-bold opacity-100 ${
                isActive
                  ? 'bg-[#008F66] text-[#245A49]'
                  : 'bg-[#A9A9A9] text-white group-hover:bg-[#008F66] group-hover:text-[#245A49]'
              }`}
            >
              <span className="absolute inset-0 flex items-center justify-center leading-none [transform:translateY(-0.5px)]">
                {badge}
              </span>
            </span>
          ) : null}
        </div>
      )}
    </NavLink>
  );
}

function PanelSidebar({ roleLabel, navItems }) {
  const { logout, isPending } = useLogout();
  const navHeight = navItems.length * 31 + (navItems.length - 1) * 21 + 24;

  return (
    <aside className="flex h-[998px] w-[288px] shrink-0 rotate-0 self-start flex-col items-center gap-[25px] overflow-hidden rounded-[6px] border border-[#006045] bg-white p-3 opacity-100">
      <div className="flex h-[61px] w-[262px] rotate-0 items-start justify-between gap-4 rounded-[12px] border border-[#0E6A50] bg-white p-2 opacity-100">
        <div className="flex min-w-0 flex-1 flex-col items-end gap-[5px] text-right opacity-100">
          <span className="w-full truncate text-right font-['Inter'] text-base font-normal leading-none tracking-normal text-[#222020] opacity-100">
            {roleLabel.name}
          </span>
          <span className="w-full truncate text-right font-['Inter'] text-base font-normal leading-none tracking-normal text-[#222020] opacity-100">
            {roleLabel.title}
          </span>
        </div>
        <HiOutlineCheckBadge className="h-5 w-5 shrink-0 text-karava-green-dark" />
      </div>

      <nav
        className="flex w-[262px] rotate-0 flex-col gap-[21px] bg-white p-3 opacity-100"
        style={{ height: `${navHeight}px` }}
      >
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        disabled={isPending}
        className="mt-auto flex h-[46px] w-[268px] shrink-0 rotate-0 items-center justify-center gap-2.5 rounded-lg border border-[#FF2020] bg-white p-2.5 text-xs leading-[15px] text-[#FF2020] opacity-100 transition-colors hover:bg-karava-bg-subtle disabled:opacity-60"
      >
        <span className="h-[15px] w-[71px] rotate-0 whitespace-nowrap font-['Inter'] text-xs font-normal leading-none tracking-normal text-[#FF2020] opacity-100">
          خروج از سیستم
        </span>
        <HiOutlineArrowRightOnRectangle className="h-6 w-6 shrink-0 rotate-0 text-[#FF2020] opacity-100" />
      </button>
    </aside>
  );
}

export default PanelSidebar;
