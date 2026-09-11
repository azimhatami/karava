import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { checkOtp } from '../../services/authService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineCheckCircle } from 'react-icons/hi2';
import OtpInput from 'react-otp-input';
import Loading from '../../ui/Loading';
import { resetAuthRefreshState } from '../../services/httpService';
import { logoutUser } from '../../services/authService';
import { digitsOnly } from '../../utils/normalizeDigits';
import { toPersianNumbers } from '../../utils/toPersianNumbers';

const RESEND_TIME = 90;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return toPersianNumbers(`${mins}:${secs}`);
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
      ? '#C9093D'
      : otpState === 'success'
        ? '#1E7C50'
        : '#E4E1D6';

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
      className="w-full max-w-[460px] rounded-2xl border border-ink-line bg-ink-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8"
    >
      <div className="mb-7 space-y-3 text-center">
        <h2 className="text-xl font-black text-ink-text">تایید شماره موبایل</h2>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-ink-muted">
          <span>کد تایید ارسال‌شده به</span>
          <span
            dir="ltr"
            className="font-['Sora',_sans-serif] text-[13px] text-ink-text"
          >
            {digitsOnly(phoneNumber)}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[13px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            ویرایش
          </button>
        </div>
      </div>

      <div dir="ltr" className="mb-5 w-full">
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
                  event.clipboardData?.getData('text') || ''
                ).slice(0, 6);
                if (!pasted) return;
                event.preventDefault();
                handleOtpChange(pasted);
              }}
            />
          )}
          containerStyle="flex flex-row justify-between gap-2"
          inputStyle={{
            width: '52px',
            height: '56px',
            borderRadius: 10,
            border: `1px solid ${inputBorderColor}`,
            backgroundColor: '#F1EFE8',
            color: '#0E1F1A',
            fontSize: '1.125rem',
            fontWeight: 700,
            outline: 'none',
            transition: 'border-color 200ms ease',
          }}
        />
      </div>

      {otpState === 'error' && otp.length !== 6 ? (
        <p className="mb-4 text-center text-xs text-[#C9093D]">
          کد تایید باید ۶ رقم باشد
        </p>
      ) : null}

      <div className="mb-6 text-center">
        {time > 0 ? (
          <p className="text-[13px] text-ink-dim">
            ارسال مجدد کد تا {formatTime(time)}
          </p>
        ) : (
          <button
            type="button"
            className="text-[13px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
            onClick={handleResendOtp}
          >
            ارسال مجدد کد تایید
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isPending ? (
          <div className="flex h-12 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-ink-raised text-sm font-bold text-[#F2F6F4] transition-[filter] hover:brightness-125"
          >
            تایید ورود
            <HiOutlineCheckCircle className="h-[18px] w-[18px] text-ink-mint" />
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="h-11 w-full rounded-[10px] border border-ink-line bg-ink-card text-[13.5px] font-medium text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
        >
          ویرایش شماره موبایل
        </button>
      </div>
    </form>
  );
}

export default CheckOTPForm;
