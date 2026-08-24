import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiUser } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

function FreelancerPanelHeader() {
  const { user } = useUser();

  return (
    <header className="h-[88px] bg-karava-bg-subtle">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between pl-6 pr-[108px]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EC]">
            <HiMagnifyingGlass className="h-6 w-6 text-karava-green" />
          </div>
          <div>
            <Link to="/" className="text-2xl font-bold text-karava-green">
              کارآوا
            </Link>
            <p className="text-xs text-karava-gray-blue">سامانه رسمی کاریابی و پروژه</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[6px] bg-white px-3 py-2 text-sm text-[#111827]">
            <HiUser className="h-4 w-4" />
            <span>نقش: کاربر فریلنسر</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[6px] bg-white px-3 py-2 text-sm text-[#111827]"
          >
            <span>{user?.name || 'کاربر'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default FreelancerPanelHeader;
