import { useMutation } from '@tanstack/react-query';
import React, { useState } from "react";
import { checkOtp } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import OtpInput from "react-otp-input";

function CheckOTPForm({ phoneNumber }) {

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const { isPending, error, data, mutateAsync } = useMutation({
    mutationFn: checkOtp,
  });

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
