import { useMutation } from '@tanstack/react-query';
import { getOtp } from '../../services/authService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { useState } from 'react';
import CheckOTPForm from './CheckOTPForm';
import RoleSelectForm from './RoleSelectForm';
import SendOTPForm from './SendOTPForm';
import { useForm } from 'react-hook-form';
import { digitsOnly } from '../../utils/normalizeDigits';


const AuthContainer = () => {

  const { handleSubmit, register, getValues, formState: { errors } } = useForm();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState(0);
  
  const { isPending: isSendingOtp, mutateAsync, data: otpResponse } = useMutation({
    mutationFn: getOtp,
  })

  const sendOtpHandler = async (data) => {
    try {
      const phone = digitsOnly(data.phoneNumber).slice(0, 11);
      const { message } = await mutateAsync({ phoneNumber: phone });
      setPhoneNumber(phone);
      setStep(2)
      toast.success(message)
    } catch(error) {
      toast.error(getApiErrorMessage(error, 'ارسال کد تایید انجام نشد.'));
    }

  };
  

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <RoleSelectForm
            onSelectRole={(role) => {
              setSelectedRole(role);
              setStep(1);
            }}
          />
        );
      case 1:
        return(
          <SendOTPForm 
            selectedRole={selectedRole}
            onBack={() => setStep(0)}
            onSubmit={handleSubmit(sendOtpHandler)}
            isSendingOtp={isSendingOtp}
            register={register}
            errors={errors}
          />
        );
      case 2:
        return(
          <CheckOTPForm 
            phoneNumber={phoneNumber || getValues('phoneNumber')} 
            selectedRole={selectedRole}
            onBack={() => setStep(s => s - 1)} 
            onResendOtp={handleSubmit(sendOtpHandler)}
            otpResponse={otpResponse}
          />
        );
      default:
        return null
    }
  };

  return <div className="flex w-full justify-center">{renderStep()}</div>;
};


export default AuthContainer;
