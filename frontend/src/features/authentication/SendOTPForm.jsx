import { useNavigate } from 'react-router-dom';
import {
  HiOutlineXMark,
  HiArrowLeft,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2';
import Loading from '../../ui/Loading';
import { digitsOnly, numericFieldOptions } from '../../utils/normalizeDigits';

const roleBadgeLabels = {
  FREELANCER: 'کارجو',
  OWNER: 'کارفرما',
  ADMIN: 'مدیر سیستم',
};

const SendOTPForm = ({
  onSubmit,
  isSendingOtp,
  register,
  errors,
  selectedRole,
  onBack,
}) => {
  const navigate = useNavigate();
  const phoneRegister = register(
    'phoneNumber',
    numericFieldOptions({
      required: 'شماره موبایل ضروری است',
      minLength: { value: 11, message: 'شماره موبایل باید ۱۱ رقم باشد' },
      pattern: {
        value: /^09[0-9]{9}$/,
        message: 'شماره موبایل نامعتبر است',
      },
    })
  );

  return (
    <div className="relative w-full max-w-[440px] rounded-2xl border border-ink-line bg-ink-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
        aria-label="بستن"
      >
        <HiOutlineXMark className="h-5 w-5" />
      </button>

      <div className="mb-7 flex flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-raised text-ink-mint">
          <HiOutlineDevicePhoneMobile className="h-7 w-7" />
        </span>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-ink-text">
            شماره موبایل خود را وارد کنید
          </h2>
          <p className="text-sm leading-7 text-ink-muted">
            کد تایید شش‌رقمی برای شما پیامک می‌شود.
          </p>
        </div>

        {selectedRole ? (
          <span className="flex items-center gap-2 rounded-full bg-ink-well px-3 py-1.5 text-[12.5px] text-ink-muted">
            ورود به عنوان
            <span className="font-bold text-ink-mint-deep">
              {roleBadgeLabels[selectedRole]}
            </span>
          </span>
        ) : null}
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-[13px] font-medium text-ink-body"
          >
            شماره موبایل
          </label>
          <input
            {...phoneRegister}
            id="phoneNumber"
            type="text"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="09123456789"
            onChange={(event) => {
              event.target.value = digitsOnly(event.target.value).slice(0, 11);
              phoneRegister.onChange(event);
            }}
            className="h-12 w-full rounded-[10px] border border-ink-line bg-ink-card px-4 text-center font-['Sora',_sans-serif] text-[15px] tracking-[0.08em] text-ink-text outline-none transition-colors placeholder:tracking-normal placeholder:text-ink-dim focus:border-ink-mint-mid focus:ring-1 focus:ring-ink-mint-mid"
          />
          {errors?.phoneNumber ? (
            <span className="block text-xs text-[#C9093D]">
              {errors.phoneNumber.message || 'شماره موبایل نامعتبر است'}
            </span>
          ) : null}
        </div>

        {isSendingOtp ? (
          <div className="flex h-12 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-ink-raised text-sm font-bold text-[#F2F6F4] transition-[filter] hover:brightness-125"
          >
            دریافت کد تایید
            <HiArrowLeft className="h-[18px] w-[18px] text-ink-mint" />
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="h-11 w-full rounded-[10px] border border-ink-line bg-ink-card text-[13.5px] font-medium text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
        >
          تغییر نوع ورود
        </button>
      </form>
    </div>
  );
};

export default SendOTPForm;
