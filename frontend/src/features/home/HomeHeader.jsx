import { Link } from 'react-router-dom';
import { HiArrowLeftOnRectangle, HiPlus } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

const dashboardPaths = {
  FREELANCER: '/freelancer',
  OWNER: '/owner',
  ADMIN: '/admin',
};

const navItems = [
  { label: 'پروژه‌ها', to: '/', active: true },
  { label: 'دسته‌بندی‌ها', to: '/' },
  { label: 'راهنما', to: '/' },
];

// The header sits on the home page's dark "ink" band, but the project and
// public-profile pages render it on the light paper background.
const variants = {
  ink: {
    wordmark: 'text-ink-mint',
    brand: 'text-[#F2F6F4]',
    navActive: 'text-sm font-bold text-[#F2F6F4]',
    nav: 'text-sm text-ink-dim transition-colors hover:text-[#F2F6F4]',
  },
  paper: {
    wordmark: 'text-ink-mint-mid',
    brand: 'text-ink-text',
    navActive: 'text-sm font-bold text-ink-text',
    nav: 'text-sm text-ink-muted transition-colors hover:text-ink-text',
  },
};

function HomeHeader({ variant = 'ink' }) {
  const { user } = useUser();
  const dashboardPath = user ? dashboardPaths[user.role] || '/' : null;
  const theme = variants[variant] || variants.ink;

  return (
    <header className="flex h-auto flex-wrap items-center justify-between gap-4 py-5 md:h-[76px] md:flex-nowrap md:py-0">
      <div className="flex items-center gap-6 md:gap-10">
        <Link to="/" className="flex items-baseline gap-2.5">
          <span
            className={`font-['Sora',_sans-serif] text-[19px] font-bold tracking-[0.14em] ${theme.wordmark}`}
          >
            KARAVA
          </span>
          <span className={`text-xl font-black ${theme.brand}`}>کارآوا</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={item.active ? theme.navActive : theme.nav}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link
            to={dashboardPath}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink-mint px-5 text-sm font-bold text-ink transition-[filter] hover:brightness-105"
          >
            <HiArrowLeftOnRectangle className="h-[18px] w-[18px]" />
            پنل کاربری
          </Link>
        ) : (
          <>
            <Link to="/auth" className={theme.nav}>
              ورود
            </Link>
            <Link
              to="/auth"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-ink-mint px-5 text-sm font-bold text-ink transition-[filter] hover:brightness-105"
            >
              <HiPlus className="h-[17px] w-[17px]" strokeWidth={1} />
              ثبت پروژه
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
