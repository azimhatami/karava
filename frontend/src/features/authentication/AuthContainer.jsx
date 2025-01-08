import { useMutation } from '@tanstack/react-query';
import { getOtp } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import CheckOTPForm from './CheckOTPForm';
import SendOTPForm from './SendOTPForm';
import { useForm } from 'react-hook-form';


const AuthContainer = () => {

  const { handleSubmit, register, getValues } = useForm();
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState(1);
  
  const { isPending: isSendingOtp, mutateAsync, data: otpResponse } = useMutation({
    mutationFn: getOtp,
  })

  const sendOtpHandler = async (data) => {
    try {
      const { message } = await mutateAsync(data);
      setStep(2)
      toast.success(message)
    } catch(error) {
      toast.error(error?.response?.data?.message)
    }

  };
  

  const renderStep = () => {
    switch(step) {
      case 1:
        return(
          <SendOTPForm 
            setStep={setStep} 
            // phoneNumber={phoneNumber} 
            // onChange={(e) => setPhoneNumber(e.target.value)} 
            onSubmit={handleSubmit(sendOtpHandler)}
            isSendingOtp={isSendingOtp}
            register={register}
          />
        );
      case 2:
        return(
          <CheckOTPForm 
            phoneNumber={getValues('phoneNumber')} 
            onBack={() => setStep(s => s - 1)} 
            onResendOtp={handleSubmit(sendOtpHandler)}
            otpResponse={otpResponse}
          />
        );
      default:
        return null
    }
  };

  return(
      <div className='w-full sm:max-w-md'>
        {renderStep()}
      </div>
  );
};


export default AuthContainer;
