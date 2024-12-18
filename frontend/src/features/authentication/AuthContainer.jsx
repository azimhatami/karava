import { useState } from 'react';
import CheckOTPForm from './CheckOTPForm';
import SendOTPForm from './SendOTPForm';

const AuthContainer = () => {
  
  const [phoneNumber, setPhoneNumber] = useState('');

  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch(step) {
      case 1:
        return(
          <SendOTPForm 
            setStep={setStep} 
            phoneNumber={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} />
        );
      case 2:
        return <CheckOTPForm phoneNumber={phoneNumber} />
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
