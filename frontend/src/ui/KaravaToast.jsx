import { HiCheck, HiXMark } from 'react-icons/hi2';
import hotToast from 'react-hot-toast';
import karava from '../theme/karava';

const VARIANTS = {
  success: {
    iconBg: karava.greenDark,
    barColor: karava.greenDark,
    Icon: HiCheck,
  },
  error: {
    iconBg: karava.red,
    barColor: karava.red,
    Icon: HiXMark,
  },
  info: {
    iconBg: karava.greenDark,
    barColor: karava.greenDark,
    Icon: HiCheck,
  },
};

function KaravaToast({ t, variant = 'success', title, subtitle }) {
  const config = VARIANTS[variant] || VARIANTS.success;
  const Icon = config.Icon;

  return (
    <div
      className={`relative flex h-[122px] w-[317px] flex-col items-center gap-[9px] rounded-[6px] border border-gray-200 bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300 ${
        t.visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="بستن"
        onClick={() => hotToast.dismiss(t.id)}
        className="absolute left-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border border-karava-green-dark text-karava-green-dark transition-colors hover:bg-karava-bg-subtle"
      >
        <HiXMark className="h-3 w-3" />
      </button>

      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: config.iconBg }}
      >
        <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-bold leading-[19px] text-karava-text">
          {title || 'خطایی رخ داد'}
        </p>
        {subtitle ? (
          <p className="text-xs font-normal leading-[15px] text-karava-gray">{subtitle}</p>
        ) : null}
      </div>

      <div
        className="h-[2px] w-[55%] shrink-0 rounded-full"
        style={{ backgroundColor: config.barColor }}
      />
    </div>
  );
}

export default KaravaToast;
