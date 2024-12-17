import React, { useState } from "react";
import OtpInput from "react-otp-input";

function CheckOTPForm() {
  const [otp, setOtp] = useState("");
  return (
    <div className="space-y-10">
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
    </div>
  );
}

export default CheckOTPForm;
