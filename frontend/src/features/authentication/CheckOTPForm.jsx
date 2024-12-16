import React, { useState } from "react";
import OTPInput from "react-otp-input";

function CheckOTPForm() {
  const [otp, setOtp] = useState("");
  return (
    <div className="space-y-8">
      <p className="font-bold text-secondary-800">کد تایید را وارد کنید</p>
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span> - </span>}
        renderInput={(props) => <input {...props}/>}
        inputType="number"
        containerStyle='flex flex-row-reverse gap-x-3 justify-center'
        inputStyle={{
            widht: '2.5rem',
            padding: '0.4rem 1rem',
            border: '1px solid rgb(var(--color-primary-300))',
            borderRadius: '0.5rem',
        }}
      />
      <button className="btn btn-primary w-full">تایید کد</button>
    </div>
  );
}

export default CheckOTPForm;
