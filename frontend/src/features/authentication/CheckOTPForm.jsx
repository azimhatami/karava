import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { checkOtp } from '../../services/authService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { HiCheckCircle } from 'react-icons/hi2';
import OtpInput from 'react-otp-input';
import Loading from '../../ui/Loading';
import { resetAuthRefreshState } from '../../services/httpService';
import { logoutUser } from '../../services/authService';
import karava from '../../theme/karava';

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
      : otpState === 'filled'
        ? karava.green
        : '#9CA3AF';

  const checkOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const { user } = await mutateAsync({
        phoneNumber: String(phoneNumber || '').trim(),
        otp: String(otp || '').trim(),
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
    const next = String(value);
    setOtp(next);
    if (otpState === 'error') {
      setOtpState(next.length ? 'filled' : 'empty');
      return;
    }
    setOtpState(next.length ? 'filled' : 'empty');
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
      <div className="space-y-2 text-center">
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
      </div>

      <div className="space-y-3">
        <div dir="ltr">
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            shouldAutoFocus
            inputType="tel"
            renderInput={(props) => (
              <input
                {...props}
                type="tel"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            )}
            containerStyle="flex flex-row justify-between gap-2"
            inputStyle={{
              width: '3rem',
              height: '3rem',
              borderRadius: 6,
              border: `1px solid ${inputBorderColor}`,
              backgroundColor: karava.bgSubtle,
              color: '#111827',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
        </div>

        <div className="text-center text-sm text-[#374151]">
          {time > 0 ? (
            <p>ارسال مجدد کد تا {formatTime(time)}</p>
          ) : (
            <button
              type="button"
              className="font-medium text-karava-green"
              onClick={handleResendOtp}
            >
              ارسال مجدد کد تایید
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        {isPending ? (
          <div className="flex flex-[7] items-center justify-center py-2.5">
            <Loading />
          </div>
        ) : (
          <button
            type="submit"
            className="flex flex-[7] items-center justify-center gap-2 rounded-[6px] bg-karava-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
          >
            <span>تایید ورود</span>
            <HiCheckCircle className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="flex flex-[3] items-center justify-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
        >
          ویرایش شماره موبایل
        </button>
      </div>
    </form>
  );
}

export default CheckOTPForm;
