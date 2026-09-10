import { useNavigate } from 'react-router-dom';
import {
  HiOutlineXCircle,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineUserCircle,
} from 'react-icons/hi2';

const roles = [
  {
    id: 'FREELANCER',
    title: 'کارجو',
    badge: 'فریلنسر/جویای کار',
    description: 'جستجوی فرصت‌های شغلی و ارسال درخواست',
    buttonText: 'ورود به عنوان کارجو',
    icon: HiOutlineUserGroup,
  },
  {
    id: 'OWNER',
    title: 'کارفرما',
    badge: 'شرکت/صاحبان ویژه',
    description: 'ایجاد فرصت شغلی و مدیریت درخواست‌ها',
    buttonText: 'ورود به عنوان کارفرما',
    icon: HiOutlineBuildingOffice2,
  },
  {
    id: 'ADMIN',
    title: 'مدیر سیستم',
    badge: 'مدیریت/ارشد سامانه',
    description: 'نظارت بر کاربران، پروژه‌ها و درخواست‌های سامانه',
    buttonText: 'ورود به عنوان مدیر',
    icon: HiOutlineUserCircle,
  },
];

function RoleSelectForm({ onSelectRole }) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full max-w-[588px] flex-col gap-[22px] rounded-[6px] border border-[#D1D5DB] bg-white p-3 sm:min-h-[491px]">
      <div className="relative flex flex-col items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center"
          aria-label="بستن"
        >
          <HiOutlineXCircle className="h-10 w-10 text-[#0E6A50]" />
        </button>

        <span className="flex h-[41px] w-[41px] items-center justify-center text-[#006045]">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m10 17 5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          </svg>
        </span>

        <div className="space-y-1 px-10 text-center sm:px-0">
          <h1 className="text-base font-bold text-[#111827]">
            چطور می‌خواهید وارد شوید؟
          </h1>
          <p className="text-sm leading-6 text-karava-gray-blue">
            نوع ورود خود را انتخاب کنید تا شما را به پنل مربوطه هدایت کنیم
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-3">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <div
              key={role.id}
              className="flex w-full flex-col gap-3 rounded-[10px] border border-[#6E6E6E] bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-2.5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-[#E8F3EE] text-[#007A55]">
                  <Icon className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1 text-right">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-sm font-bold leading-5 text-[#222020] sm:text-base sm:leading-none">
                      {role.title}
                    </span>
                    <span className="inline-flex max-w-full items-center rounded-[6px] bg-[#ECFDF5] px-1.5 py-0.5 text-[11px] leading-4 text-karava-green sm:text-xs sm:leading-none">
                      {role.badge}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-5 text-[#6E6E6E] sm:mt-[9px] sm:text-base sm:leading-5">
                    {role.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectRole(role.id)}
                className="inline-flex h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] bg-[#F1F5F9] px-3 text-sm text-[#222020] transition-colors hover:bg-[#E5EDF5] sm:h-[37px] sm:w-auto"
              >
                {role.buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelectForm;
