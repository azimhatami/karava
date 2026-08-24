import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiUser } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

function OwnerPanelHeader() {
  const { user } = useUser();

  return (
    <header className="owner-panel-header h-[88px] border-b border-[#E5E7EB]">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between pl-6 pr-[108px]">
        <div className="flex max-w-full items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F4EC]">
            <HiMagnifyingGlass className="h-6 w-6 text-karava-green" />
          </div>
          <div className="min-w-0">
            <Link to="/" className="text-xl font-bold leading-7 text-karava-green">
              کارآوا
            </Link>
            <p className="text-xs leading-4 text-karava-gray-blue">سامانه رسمی کاریابی و پروژه</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-[42px] w-[184px] items-center gap-2.5 rounded-[12px] border border-karava-green bg-white p-2.5">
            <HiUser className="h-4 w-4 shrink-0 text-karava-green" />
            <span className="truncate text-sm text-karava-text">نقش: کارفرما</span>
          </div>

          <button
            type="button"
            className="owner-panel-user-btn inline-flex h-[42px] min-w-[80px] items-center rounded-[12px] border border-[#222020] bg-white p-2"
          >
            <div className="flex min-w-0 flex-col justify-center gap-px text-right leading-none">
              <span className="whitespace-nowrap">{user?.name || 'کاربر'}</span>
              <span className="whitespace-nowrap">کارفرما</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

export default OwnerPanelHeader;
