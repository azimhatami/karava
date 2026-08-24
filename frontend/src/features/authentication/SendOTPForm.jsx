import { useNavigate } from 'react-router-dom';
import { HiXMark, HiArrowLeft, HiDevicePhoneMobile } from 'react-icons/hi2';
import Loading from '../../ui/Loading';

const roleBadgeLabels = {
  FREELANCER: 'ورود به عنوان کارجو',
  OWNER: 'ورود به عنوان کارفرما',
  ADMIN: 'ورود به عنوان مدیر',
};

const SendOTPForm = ({
  onSubmit,
  isSendingOtp,
  register,
  selectedRole,
  onBack,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full max-w-[408px] min-h-[399px] flex-col gap-[31px] rounded-[6px] border border-[#D1D5DB] bg-white p-[10px]">
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#374151]">نقش انتخاب شده:</span>
            {selectedRole && (
              <span className="rounded-full bg-[#E6F4EC] px-2.5 py-1 text-xs font-medium text-karava-green">
                {roleBadgeLabels[selectedRole]}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-karava-green text-karava-green transition-colors hover:bg-[#E8F3EE]"
            aria-label="بستن"
          >
            <HiXMark className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#E5E7EB]" />
      </div>

      <form className="flex flex-1 flex-col gap-[31px]" onSubmit={onSubmit}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F3EE]">
            <HiDevicePhoneMobile className="h-8 w-8 text-karava-green" />
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-bold text-[#111827]">
              شماره موبایل خود را وارد کنید
            </h2>
            <p className="text-sm leading-6 text-karava-gray-blue">
              برای ورود امن به حساب کاربری، شماره موبایل خود را وارد کنید.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block text-right text-sm text-[#374151]"
          >
            شماره موبایل
          </label>
          <input
            {...register('phoneNumber', { required: true })}
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="09123456789"
            className="w-full rounded-[6px] border border-[#9CA3AF] bg-white px-4 py-3 text-center text-sm text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-karava-green focus:ring-1 focus:ring-karava-green"
          />
        </div>

        <div className="mt-auto flex gap-3">
          {isSendingOtp ? (
            <div className="flex flex-[7] items-center justify-center py-2.5">
              <Loading />
            </div>
          ) : (
            <button
              type="submit"
              className="flex flex-[7] items-center justify-center gap-2 rounded-[6px] bg-karava-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
            >
              <span>دریافت کد تایید</span>
              <HiArrowLeft className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="flex flex-[3] items-center justify-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            تغییر نوع ورود
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendOTPForm;
