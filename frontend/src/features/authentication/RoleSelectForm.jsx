import { useNavigate } from 'react-router-dom';
import {
  HiOutlineXMark,
  HiOutlineUserGroup,
  HiOutlineBuildingOffice2,
  HiOutlineUserCircle,
  HiArrowLeft,
} from 'react-icons/hi2';

const roles = [
  {
    id: 'FREELANCER',
    title: 'کارجو',
    badge: 'فریلنسر / جویای کار',
    description: 'جستجوی فرصت‌های شغلی و ارسال پیشنهاد',
    icon: HiOutlineUserGroup,
  },
  {
    id: 'OWNER',
    title: 'کارفرما',
    badge: 'شرکت / کسب‌وکار',
    description: 'ثبت پروژه و مدیریت پیشنهادها',
    icon: HiOutlineBuildingOffice2,
  },
  {
    id: 'ADMIN',
    title: 'مدیر سیستم',
    badge: 'مدیریت سامانه',
    description: 'نظارت بر کاربران، پروژه‌ها و پیشنهادها',
    icon: HiOutlineUserCircle,
  },
];

function RoleSelectForm({ onSelectRole }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-[560px] rounded-2xl border border-ink-line bg-ink-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
        aria-label="بستن"
      >
        <HiOutlineXMark className="h-5 w-5" />
      </button>

      <div className="mb-7 space-y-2 text-center">
        <h1 className="text-xl font-black text-ink-text">
          چطور می‌خواهید وارد شوید؟
        </h1>
        <p className="text-sm leading-7 text-ink-muted">
          نوع ورود خود را انتخاب کنید تا به پنل مربوطه هدایت شوید
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {roles.map((role) => {
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className="group flex w-full items-center gap-4 rounded-xl border border-ink-line bg-ink-card p-4 text-right transition-all hover:border-ink-raised hover:bg-ink-well"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-raised text-ink-mint">
                <Icon className="h-6 w-6" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-[15px] font-bold text-ink-text">
                    {role.title}
                  </span>
                  <span className="rounded-full bg-ink-mint-tint px-2.5 py-0.5 text-[11.5px] font-medium text-ink-mint-deep">
                    {role.badge}
                  </span>
                </span>
                <span className="mt-1.5 block text-[13px] leading-6 text-ink-muted">
                  {role.description}
                </span>
              </span>

              <HiArrowLeft className="h-5 w-5 shrink-0 text-ink-dim transition-colors group-hover:text-ink-mint-mid" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RoleSelectForm;
