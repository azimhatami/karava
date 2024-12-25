import TextField from "../../ui/TextField";
import Loading from '../../ui/Loading';

const SendOTPForm = ({ onSubmit, isSendingOtp, register }) => {

  return (
    <>
      <form className="space-y-8" onSubmit={onSubmit}>
        <TextField
          label="شماره تلفن"
          name="phoneNumber"
          register={register}
        />
        <div>
          {isSendingOtp ? (
            <Loading />
          ) : (
            <button type='submit' className="btn btn-primary w-full">
              ارسال کد تایید
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default SendOTPForm;
