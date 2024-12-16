import { useState } from 'react';


const SendOTPForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  return(
    <>
      <form className='space-y-6'>
        <div className='space-y-2'>
          <label htmlFor='phonenumber' className=''>شماره موبایل</label>
          <input
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            id='phonenumber'
            type='text' 
            className='textField_input'
          />
        </div>
        <button 
          className='btn btn-primary w-full'
        >
          ارسال کد تایید
        </button>
      </form>
    </>
  );
};

export default SendOTPForm;
