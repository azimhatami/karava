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
            className='w-full py-3 px-4 rounded-xl text-secondary-900 border \
              border-gray-300 outline-none hover:border-primary-500 \
              focus:outline-none focus:border-primary-500 focus:bg-white \
              transition-all duration-300 ease-out focus:shadow-lg focus:shadow-primary-300' 
          />
        </div>
        <button 
          className='bg-primary-900 w-full py-1.5 text-white font-bold \
            rounded-xl transition-all duration-300 hover:bg-primary-800 \
            shadow-lg shadow-primary-300'
        >
          ارسال کد تایید
        </button>
      </form>
    </>
  );
};

export default SendOTPForm;
