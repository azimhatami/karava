import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { checkOtp } from '../../services/authService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import OtpInput from 'react-otp-input';
import Loading from '../../ui/Loading';
import { resetAuthRefreshState } from '../../services/httpService';
import { logoutUser } from '../../services/authService';
import karava from '../../theme/karava';
import { digitsOnly } from '../../utils/normalizeDigits';

const RESEND_TIME = 90;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

const ROLE_REDIRECT_SUBTITLES = {
  OWNER: 'در حال هدایت به داشبورد اختصاصی کارفرما',
  FREELANCER: 'در حال هدایت به داشبورد اختصاصی کارجو',
  ADMIN: 'در حال هدایت به داشبورد اختصاصی ادمین',
};

const ROLE_MISMATCH_MESSAGE = 'این شماره موبایل با نقش انتخاب‌شده مطابقت ندارد.';

const SUCCESS_BORDER_DELAY_MS = 700;

function CheckOTPForm({ phoneNumber, selectedRole, onBack, onResendOtp }) {
  const [otp, setOtp] = useState('');
  const [otpState, setOtpState] = useState('empty');
  const [time, setTime] = useState(RESEND_TIME);
  const navigate = useNavigate();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: checkOtp,
  });

  const inputBorderColor =
    otpState === 'error'
      ? karava.red
      : otpState === 'success'
        ? '#006045'
        : '#222020';

  const continueAfterVerifiedOtp = (user) => {
    resetAuthRefreshState();

    if (!user.isActive) {
      toast.success('ورود با موفقیت انجام شد', {
        subtitle: 'لطفا اطلاعات خود را تکمیل کنید',
      });
      return navigate('/complete-profile');
    }

    if (Number(user.status) !== 2) {
      navigate('/');
      toast.info('پروفایل شما در انتظار تایید است');
      return;
    }

    toast.success('ورود با موفقیت انجام شد', {
      subtitle: ROLE_REDIRECT_SUBTITLES[user.role],
    });

    if (user.role === 'OWNER') return navigate('/owner');
    if (user.role === 'FREELANCER') return navigate('/freelancer');
    if (user.role === 'ADMIN') return navigate('/admin');
  };

  const checkOtpHandler = async (e) => {
    e.preventDefault();
    const normalizedOtp = digitsOnly(otp);
    if (normalizedOtp.length !== 6) {
      setOtpState('error');
      toast.error('کد تایید باید ۶ رقم باشد');
      return;
    }
    try {
      const { user } = await mutateAsync({
        phoneNumber: digitsOnly(phoneNumber).slice(0, 11),
        otp: normalizedOtp,
      });

      if (selectedRole && user.role !== selectedRole) {
        try {
          await logoutUser();
        } catch {
          // ignore logout errors after role mismatch
        }
        resetAuthRefreshState();
        setOtpState('error');
        toast.error(ROLE_MISMATCH_MESSAGE);
        return;
      }

      setOtpState('success');
      await new Promise((resolve) => setTimeout(resolve, SUCCESS_BORDER_DELAY_MS));
      continueAfterVerifiedOtp(user);
    } catch (error) {
      setOtpState('error');
      toast.error(getApiErrorMessage(error, 'تایید کد انجام نشد.'));
    }
  };

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time]);

  const handleOtpChange = (value) => {
    if (otpState === 'success') return;
    setOtp(digitsOnly(value).slice(0, 6));
    if (otpState === 'error') setOtpState('empty');
  };

  const handleResendOtp = () => {
    setTime(RESEND_TIME);
    setOtp('');
    setOtpState('empty');
    onResendOtp();
  };

  return (
    <form
      onSubmit={checkOtpHandler}
      className="flex h-[290px] w-full max-w-[460px] flex-col justify-between rounded-[6px] border border-[#D1D5DB] bg-white p-3"
    >
      <div className="mx-auto flex h-[184px] w-[436px] max-w-full rotate-0 flex-col items-center justify-between gap-[18px] opacity-100">
        <h2 className="text-base font-bold text-[#111827]">تایید شماره موبایل</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-[#374151]">
          <span>
            کد تایید ارسال شده به شماره {phoneNumber} را وارد کنید
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-karava-green"
          >
            <CiEdit className="h-4 w-4" />
            ویرایش
          </button>
        </div>

        <div dir="ltr" className="w-full">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            shouldAutoFocus
            // IMPORTANT: inputType "tel"/"number" reject Persian/Arabic digits
            // because the library uses Number(value) which yields NaN for ۰-۹.
            inputType="text"
            renderInput={(props) => (
              <input
                {...props}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                onChange={(event) => {
                  const normalized = digitsOnly(event.target.value).slice(-1);
                  event.target.value = normalized;
                  props.onChange?.(event);
                }}
                onPaste={(event) => {
                  const pasted = digitsOnly(
                    event.clipboardData?.getData('text') || '',
                  ).slice(0, 6);
                  if (!pasted) return;
                  event.preventDefault();
                  handleOtpChange(pasted);
                }}
              />
            )}
            containerStyle="flex flex-row justify-between gap-2"
            inputStyle={{
              width: '48px',
              height: '49px',
              borderRadius: 6,
              border: `1px solid ${inputBorderColor}`,
              backgroundColor: '#E9E9E9',
              color: '#111827',
              fontSize: '1rem',
              outline: 'none',
              opacity: 1,
              transform: 'rotate(0deg)',
              transition: 'border-color 200ms ease',
            }}
          />
        </div>
        {otpState === 'error' && otp.length !== 6 ? (
          <p className="text-center text-xs text-karava-red">
            کد تایید باید ۶ رقم باشد
          </p>
        ) : null}

        <div className="flex h-[17px] w-[436px] max-w-full rotate-0 items-center justify-center opacity-100">
          {time > 0 ? (
            <p className="h-[17px] w-full text-center font-['Inter'] text-[14px] font-medium leading-none tracking-normal text-[#374151]">
              ارسال مجدد کد تا {formatTime(time)}
            </p>
          ) : (
            <button
              type="button"
              className="h-[17px] w-full rotate-0 text-center font-['Inter'] text-[14px] font-medium leading-none tracking-normal text-[#222020] opacity-100"
              onClick={handleResendOtp}
            >
              ارسال مجدد کد تایید
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {isPending ? (
            <div className="flex h-[44px] w-[251px] shrink-0 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="flex h-[44px] w-[251px] shrink-0 rotate-0 items-center justify-center gap-2.5 rounded-[6px] bg-[#006045] p-2.5 text-white opacity-100 transition-colors hover:bg-karava-green-dark"
          >
            <span className="inline-block h-[17px] w-[59px] rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-bold leading-none tracking-normal text-white opacity-100">
              تایید ورود
            </span>
            <HiOutlineCheckCircle className="h-6 w-6 rotate-0 text-white opacity-100" />
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="flex h-[44px] w-[155px] shrink-0 rotate-0 items-center justify-center gap-2.5 rounded-[6px] border border-[#6E6E6E] bg-white p-2.5 opacity-100 transition-colors hover:bg-[#F9FAFB]"
        >
          <span className="inline-block h-[17px] w-[133px] rotate-0 overflow-hidden text-center font-['Inter'] text-[14px] font-bold leading-none tracking-normal text-[#6E6E6E] opacity-100">
            ویرایش شماره موبایل
          </span>
        </button>
      </div>
    </form>
  );
}

export default CheckOTPForm;
