import { useMutation } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";
import { checkOtp } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { HiArrowRight } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import OtpInput from "react-otp-input";


const RESEND_TIME = 90;

function CheckOTPForm({ phoneNumber, onBack, onResendOtp, otpResponse }) {

  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(RESEND_TIME);
  const navigate = useNavigate();

  const { isPending, error, data, mutateAsync } = useMutation({
    mutationFn: checkOtp,
  });

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000)
    return () => {
      if (timer) clearInterval(timer)
    };
  }, [time])

  const checkOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const { user, message } = await mutateAsync({phoneNumber, otp});
      toast.success(message)

      if (user.isActive) {
        // if (user.role === 'OWNER') navigate('/owner');
        // if (user.role === 'FREELANCER') navigate('/freelancer');
        // if (user.role === 'ADMIN') navigate('/admin');
      }else {
        navigate('/complete-profile')
      }

    } catch(error) {
      toast.error(error?.response?.data?.message)
    }
  };

  return (
    <div>
      <button onClick={onBack}>
        <HiArrowRight className='text-xl text-secondary-500 hover:text-secondary-700' />
      </button>
      <div>
        {otpResponse && 
          <p className='flex items-center gap-x-2'>
            <span>{otpResponse?.message}</span>
            <button onClick={onBack}>
              <CiEdit className='w-6 h-6 text-primary-900 my-3'/>
            </button>
          </p>
        }
      </div>
      <div className='mb-2 text-secondary-600'>
        {time > 0 ? (
          <p>{time} ثانیه تا ارسال کدمجدد</p>
        ) : (
          <button onClick={onResendOtp}>ارسال مجدد کد تایید</button>
        )
        } 
      </div>
      <form className='space-y-10' onSubmit={checkOtpHandler}>
        <p className="font-bold text-secondary-800">کد تایید را وارد کنید</p>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          shouldAutoFocus
          isInputNum='true'
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          containerStyle='flex flex-row-reverse gap-x-3 justify-center'
          inputStyle={{
            width: '3rem',  
            height: '3rem',  
            borderRadius: 10,  
            border: '2px solid rgb(var(--color-primary-300))',                      
          }}
        />
        
        <button className="btn btn-primary w-full">تایید کد</button>
      </form>
    </div>
  );
}

export default CheckOTPForm;
