import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiOutlineUser, HiArrowRightOnRectangle } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

const roleLabels = {
  FREELANCER: 'کاربر فریلنسر',
  OWNER: 'کارفرما',
  ADMIN: 'مدیر سیستم',
};

const dashboardPaths = {
  FREELANCER: '/freelancer',
  OWNER: '/owner',
  ADMIN: '/admin',
};

const authButtonClassName =
  'inline-flex h-[42px] w-[184px] items-center justify-center gap-[5px] rounded-[12px] bg-[#006045] p-1.5 text-sm font-bold text-white opacity-100 transition-colors hover:bg-[#004d37]';

function HomeHeader() {
  const { user } = useUser();
  const roleLabel = user ? roleLabels[user.role] || 'کاربر' : 'مهمان';

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-[72px] w-[80px] items-center justify-center gap-[10px] rounded-[448px] bg-[#ADD2C0] p-[10px] opacity-100">
          <HiMagnifyingGlass className="h-[53px] w-[53px] rotate-0 px-px text-[#346453] opacity-100" />
        </div>
        <div>
          <h1 className="h-[44px] w-[81px] text-right font-['Inter'] text-[36px] font-bold leading-none tracking-normal text-[#1D5644] opacity-100">
            کارآوا
          </h1>
          <p className="h-[19px] w-[198px] text-right font-['Inter'] text-[16px] font-bold leading-none tracking-normal text-[#035B30] opacity-100">
            سامانه رسمی کاریابی و پروژه
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-[42px] w-[184px] items-center gap-[10px] rounded-[12px] border border-[#006045] bg-white p-[10px] opacity-100">
          <HiOutlineUser className="h-[21px] w-[21px] shrink-0 rotate-0 text-[#00362E] opacity-100" />
          <span className="h-[19px] w-[137px] text-right font-['Inter'] text-[16px] font-bold leading-none tracking-normal text-[#00362E] opacity-100">
            نقش: {roleLabel}
          </span>
        </div>

        {user ? (
          <Link
            to={dashboardPaths[user.role] || '/'}
            className={authButtonClassName}
          >
            <HiArrowRightOnRectangle className="h-6 w-6 rotate-0 opacity-100" />
            ورود / ثبت نام
          </Link>
        ) : (
          <Link to="/auth" className={authButtonClassName}>
            <HiArrowRightOnRectangle className="h-6 w-6 rotate-0 opacity-100" />
            ورود / ثبت نام
          </Link>
        )}
      </div>
    </header>
  );
}

export default HomeHeader;
