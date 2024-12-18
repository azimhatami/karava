import { useMutation } from '@tanstack/react-query';
import { getOtp } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import CheckOTPForm from './CheckOTPForm';
import SendOTPForm from './SendOTPForm';

const AuthContainer = () => {

  const [phoneNumber, setPhoneNumber] = useState('09945899973');
  const [step, setStep] = useState(2);
  
  const { isPending: isSendingOtp, mutateAsync } = useMutation({
    mutationFn: getOtp,
  })

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await mutateAsync({ phoneNumber });
      setStep(2)
      toast.success(data.message)
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
            phoneNumber={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            onSubmit={sendOtpHandler}
            isSendingOtp={isSendingOtp}
          />
        );
      case 2:
        return(
          <CheckOTPForm 
            phoneNumber={phoneNumber} 
            onBack={() => setStep(s => s - 1)} 
            onResendOtp={sendOtpHandler}
          />
        );
      default:
        return null
    }
  };

  return(
    <>
      <div className='w-full sm:max-w-md'>
        {renderStep()}
      </div>
    </>
  );
};


export default AuthContainer;
