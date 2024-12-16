import { useState } from "react";
import TextField from "../../ui/TextField";

const SendOTPForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <>
      <form className="space-y-8">
        <TextField
          label="شماره تلفن"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button className="btn btn-primary w-full">ارسال کد تایید</button>
      </form>
    </>
  );
};

export default SendOTPForm;
