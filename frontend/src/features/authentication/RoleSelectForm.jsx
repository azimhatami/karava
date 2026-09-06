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
    iconClassName:
      'absolute left-[2.56px] top-[5.13px] h-[30.75px] w-[35.875px] rotate-0 text-[#007A55] opacity-100',
  },
  {
    id: 'OWNER',
    title: 'کارفرما',
    badge: 'شرکت/صاحبان ویژه',
    description: 'ایجاد فرصت شغلی و مدیریت درخواست‌ها',
    buttonText: 'ورود به عنوان کارفرما',
    icon: HiOutlineBuildingOffice2,
    iconClassName:
      'absolute left-[2.14px] top-[2.13px] h-[36.73px] w-[36.73px] rotate-0 text-[#007A55] opacity-100',
  },
  {
    id: 'ADMIN',
    title: 'مدیر سیستم',
    badge: 'مدیریت/ارشد سامانه',
    description: 'ایجاد فرصت شغلی و مدیریت درخواست‌ها',
    buttonText: 'ورود به عنوان مدیر',
    icon: HiOutlineUserCircle,
    iconClassName:
      'absolute left-[7.26px] top-[3.84px] h-[33.3125px] w-[26.48px] rotate-0 text-[#007A55] opacity-100',
  },
];

function RoleSelectForm({ onSelectRole }) {
  const navigate = useNavigate();

  return (
    <div className="flex w-full max-w-[588px] min-h-[491px] flex-col gap-[22px] rounded-[6px] border border-[#D1D5DB] bg-white p-3">
      <div className="relative flex flex-col items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute left-0 top-0 h-11 w-11 opacity-100"
          aria-label="بستن"
        >
          <HiOutlineXCircle className="absolute left-[2.29px] top-[2.29px] h-[39.41666793823242px] w-[39.41666793823242px] rotate-0 text-[#0E6A50] opacity-100" />
        </button>

        <span className="relative inline-block h-[41px] w-[41px] opacity-100">
          <svg
            className="absolute left-[3.84px] top-[3.84px] h-[33.3125px] w-[33.3125px] rotate-0 text-[#006045] opacity-100"
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

        <div className="space-y-1 text-center">
          <h1 className="text-base font-bold text-[#111827]">
            چطور می‌خواهید وارد شوید؟
          </h1>
          <p className="text-sm leading-6 text-karava-gray-blue">
            نوع ورود خود را انتخاب کنید تا شما را به پنل مربوطه هدایت کنیم
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <div
              key={role.id}
              className="flex h-20 w-full max-w-[534px] items-center justify-between gap-3 rounded-[10px] border border-[#6E6E6E] bg-white p-2.5 opacity-100"
            >
              <div className="relative h-11 w-11 shrink-0 rounded-[6px] bg-[#E8F3EE]">
                <Icon
                  className={
                    role.iconClassName ||
                    'absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-karava-green'
                  }
                />
              </div>

              <div className="flex h-[47px] w-[287px] min-w-0 flex-col justify-center gap-[9px] text-right opacity-100">
                <div className="flex h-[19px] w-[144px] items-center gap-4 whitespace-nowrap opacity-100">
                  <span
                    className={`inline-flex h-[19px] items-center justify-center text-center font-['Inter'] text-[16px] font-bold leading-none tracking-normal text-[#222020] opacity-100 ${
                      role.id === 'FREELANCER' ? 'w-[38px]' : 'w-auto'
                    }`}
                  >
                    {role.title}
                  </span>
                  <span
                    className={`inline-flex h-[19px] items-center justify-center gap-2.5 rounded-[6px] bg-[#ECFDF5] p-0.5 opacity-100 ${
                      role.id === 'FREELANCER' ? 'w-[90px]' : 'w-auto'
                    }`}
                  >
                    <span
                      className={`h-[15px] whitespace-nowrap text-center font-['Inter'] text-[12px] font-normal leading-none tracking-normal text-karava-green opacity-100 ${
                        role.id === 'FREELANCER' ? 'w-[86px]' : 'w-auto px-1'
                      }`}
                    >
                      {role.badge}
                    </span>
                  </span>
                </div>
                <p className="h-[19px] w-[287px] overflow-hidden whitespace-nowrap text-center font-['Inter'] text-[16px] font-normal leading-none tracking-normal text-[#6E6E6E] opacity-100">
                  {role.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectRole(role.id)}
                className="inline-flex h-[37px] w-[128px] shrink-0 items-center justify-center gap-2.5 rounded-[6px] bg-[#F1F5F9] p-2.5 opacity-100 transition-colors hover:bg-[#E5EDF5]"
              >
                <span className="inline-block h-[17px] w-[108px] whitespace-nowrap text-center font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-[#222020] opacity-100">
                  {role.buttonText}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelectForm;
