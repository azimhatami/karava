import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiOutlineUser } from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import PanelMenuButton from '../shared/PanelMenuButton';

function AdminPanelHeader() {
  const { user } = useUser();

  return (
    <header className="min-h-[88px] bg-karava-bg-subtle md:min-h-[103px]">
      <div className="mx-auto flex h-full max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 md:gap-6 md:px-6 xl:pl-6 xl:pr-[108px]">
        <div className="flex min-w-0 items-center gap-3 md:gap-6">
          <PanelMenuButton />
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F4EC] md:h-[80px] md:w-[80px]">
            <HiMagnifyingGlass className="h-7 w-7 text-karava-green md:h-[53px] md:w-[53px]" />
          </div>
          <div className="min-w-0 text-right">
            <Link
              to="/"
              className="block text-right text-2xl font-bold leading-none tracking-normal text-[#1D5644] md:text-[36px]"
            >
              کارآوا
            </Link>
            <p className="mt-1 hidden text-right text-sm font-bold leading-none tracking-normal text-[#035B30] sm:block md:text-base">
              سامانه رسمی کاریابی و پروژه
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 md:gap-3">
          <div className="flex h-[42px] items-center rounded-[12px] border border-[#006045] bg-white px-3 text-sm text-[#111827]">
            <div className="flex items-center gap-1">
              <HiOutlineUser className="h-5 w-5 shrink-0 text-[#00362E]" />
              <span className="whitespace-nowrap text-right text-sm font-bold leading-none tracking-normal text-[#00362E] md:text-base">
                نقش: ادمین
              </span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-[42px] max-w-[120px] items-center justify-center rounded-[12px] border border-[#222020] bg-white px-3 text-sm text-[#111827]"
          >
            <span className="max-w-full truncate text-center text-xs font-normal leading-none tracking-normal text-[#222020]">
              {user?.name || 'کاربر'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminPanelHeader;
