import { Link } from 'react-router-dom';
import { HiUser } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

function AdminPanelHeader() {
  const { user } = useUser();

  return (
    <header className="h-[88px] border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between pl-6 pr-[108px]">
        <div className="flex max-w-full items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-end text-right">
            <Link
              to="/"
              className="text-2xl font-bold leading-8 text-karava-green-dark"
            >
              کارآوا
            </Link>
            <p className="text-sm font-bold leading-[19px] text-karava-green-darker">
              سامانه رسمی کاریابی و پروژه
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-karava-green-light p-2">
            <HiUser className="h-8 w-8 text-karava-green-dark" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-[42px] w-[184px] items-center justify-end gap-1 rounded-[12px] border border-karava-green bg-white p-2.5">
            <span className="truncate text-base font-bold text-karava-green-darker">
              نقش: کاربر ادمین
            </span>
            <HiUser className="h-5 w-5 shrink-0 text-karava-green-darker" />
          </div>

          <div className="flex h-[42px] w-[80px] flex-col items-end justify-between rounded-[12px] border border-karava-text bg-white p-2">
            <span className="w-full truncate text-right text-xs leading-[15px] text-karava-text">
              {user?.name || 'کاربر'}
            </span>
            <span className="w-full truncate text-right text-xs leading-[15px] text-karava-text">
              ادمین
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminPanelHeader;
