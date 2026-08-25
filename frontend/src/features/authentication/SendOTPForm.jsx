import { useNavigate } from 'react-router-dom';
import { HiOutlineXCircle, HiArrowLeft, HiDevicePhoneMobile } from 'react-icons/hi2';
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
      <div className="flex h-[185px] w-[388px] max-w-full rotate-0 flex-col justify-between opacity-100">
        <div className="flex h-[45px] w-[388px] max-w-full rotate-0 items-center justify-between border-b border-[#6E6E6E] opacity-100">
          <div className="flex items-center gap-2">
            <span className="inline-block h-[17px] w-[104px] rotate-0 text-center font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-[#222020] opacity-100">نقش انتخاب شده:</span>
            {selectedRole && (
              <span className="inline-flex h-[22px] w-[101px] rotate-0 items-center justify-center gap-2.5 overflow-hidden rounded-[6px] bg-[#ECFDF5] p-0.5 opacity-100">
                <span className="inline-block h-[15px] w-[93px] rotate-0 overflow-hidden text-center font-['Inter'] text-[12px] font-normal leading-none tracking-normal text-[#006045] opacity-100">
                  {roleBadgeLabels[selectedRole]}
                </span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="relative h-11 w-11 shrink-0 rotate-0 opacity-100"
            aria-label="بستن"
          >
            <HiOutlineXCircle className="absolute left-[2.29px] top-[2.29px] h-[39.41666793823242px] w-[39.41666793823242px] rotate-0 text-[#0E6A50] opacity-100" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative h-[58px] w-[58px] rotate-0 rounded-[32px] bg-[#ECFDF5] opacity-100">
            <HiDevicePhoneMobile className="absolute left-[11px] top-[3px] h-[52px] w-[36px] rotate-0 text-[#00362E] opacity-100" />
          </div>

          <div className="space-y-2">
            <h2 className="h-[17px] w-[388px] max-w-full rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-bold leading-none tracking-normal text-[#222020] opacity-100">
              شماره موبایل خود را وارد کنید
            </h2>
            <p className="h-[17px] w-[388px] max-w-full rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-[#222020] opacity-100">
              برای ورود امن به حساب کاربری، شماره موبایل خود را وارد کنید.
            </p>
          </div>
        </div>
      </div>

      <form
        className="mx-auto flex h-[156px] w-[342px] max-w-full rotate-0 flex-col justify-between gap-5 opacity-100"
        onSubmit={onSubmit}
      >
        <div className="space-y-2">
          <label
            htmlFor="phoneNumber"
            className="block h-[17px] w-[342px] max-w-full rotate-0 text-right font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-[#222020] opacity-100"
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
            className="box-border h-[39px] w-[342px] max-w-full rotate-0 gap-2.5 rounded-[12px] border border-[#6E6E6E] bg-white p-2.5 text-center text-sm text-[#111827] opacity-100 outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-karava-green focus:ring-1 focus:ring-karava-green"
          />
        </div>

        <div className="flex gap-3">
          {isSendingOtp ? (
            <div className="flex h-[44px] w-[221px] shrink-0 items-center justify-center">
              <Loading />
            </div>
          ) : (
            <button
              type="submit"
              className="flex h-[44px] w-[221px] shrink-0 rotate-0 items-center justify-center gap-2.5 rounded-[12px] bg-[#00573F] p-2.5 text-white opacity-100 transition-colors hover:bg-karava-green-dark"
            >
              <span className="inline-block h-[17px] w-[88px] rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-white opacity-100">
                دریافت کد تایید
              </span>
              <span className="relative inline-block h-6 w-6 shrink-0 opacity-100">
                <HiArrowLeft className="absolute left-[2.25px] top-[4.25px] h-[15.50075626373291px] w-[19.49791717529297px] rotate-0 text-white opacity-100" />
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="flex h-[39px] w-[100px] shrink-0 rotate-0 items-center justify-center gap-2.5 rounded-[12px] border border-[#6E6E6E] bg-white p-2.5 opacity-100 transition-colors hover:bg-[#F9FAFB]"
          >
            <span className="inline-block h-[17px] w-[78px] rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-normal leading-none tracking-normal text-[#222020] opacity-100">
              تغییر نوع ورود
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendOTPForm;
