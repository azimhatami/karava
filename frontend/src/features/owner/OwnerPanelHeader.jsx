import { Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiOutlineUser } from 'react-icons/hi2';
import useUser from '../authentication/useUser';

function OwnerPanelHeader() {
  const { user } = useUser();

  return (
    <header className="h-[103px] bg-karava-bg-subtle">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 pl-6 pr-[108px]">
        <div className="flex h-[80px] w-[288px] shrink-0 items-center justify-start overflow-visible">
          <div className="flex h-[80px] w-[392px] rotate-0 items-center gap-6 opacity-100">
            <div className="flex h-[80px] w-[80px] shrink-0 rotate-0 items-center justify-center gap-[10px] rounded-[448px] bg-[#E6F4EC] p-[10px] opacity-100">
              <HiMagnifyingGlass className="h-[53px] w-[53px] text-karava-green" />
            </div>
            <div className="h-[63px] w-[198px] rotate-0 opacity-100">
              <Link
                to="/"
                className="block h-[44px] w-[198px] rotate-0 text-right font-['Inter'] text-[36px] font-bold leading-none tracking-normal text-[#1D5644] opacity-100"
              >
                کارآوا
              </Link>
              <p className="h-[19px] w-[198px] rotate-0 text-right font-['Inter'] text-[16px] font-bold leading-none tracking-normal text-[#035B30] opacity-100">
                سامانه رسمی کاریابی و پروژه
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <div className="flex h-[42px] w-[184px] rotate-0 items-center rounded-[12px] border border-[#006045] bg-white p-[10px] text-sm text-[#111827] opacity-100">
            <div className="flex h-[21px] w-[162px] rotate-0 items-center gap-1 opacity-100">
              <HiOutlineUser className="h-[21px] w-[21px] shrink-0 rotate-0 text-[#00362E] opacity-100" />
              <span className="h-[19px] rotate-0 whitespace-nowrap text-right font-['Inter'] text-[16px] font-bold leading-none tracking-normal text-[#00362E] opacity-100">
                نقش: کارفرما
              </span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-[42px] w-[80px] rotate-0 items-center justify-center rounded-[12px] border border-[#222020] bg-white p-2 text-sm text-[#111827] opacity-100"
          >
            <span className="h-[15px] max-w-full rotate-0 truncate text-center font-['Inter'] text-xs font-normal leading-none tracking-normal text-[#222020] opacity-100">
              {user?.name || 'کاربر'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default OwnerPanelHeader;
