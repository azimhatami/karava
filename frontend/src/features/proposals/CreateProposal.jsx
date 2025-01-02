import { useForm } from 'react-hook-form';
import TextField from '../../ui/TextField';
import Loading from '../../ui/Loading';


function CreateProposal({ onClose, projectId }) {

  const { register, handleSubmit, formState: {errors} } = useForm();

  const onSubmit = (data) => {
    console.log(data)
  };

  return(
    <div className=''>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="توضیحات"
          name="description"
          register={register}
          required
          validationSchema={{
            required: "توضیحات ضروری است",
            minLength: {
              value: 10,
              message: "حداقل ۱۰ کاراکتر وارد کنید",
            },
          }}
          errors={errors}
        />
        <TextField
          label="قیمت"
          name="price"
          type='number'
          register={register}
          required
          validationSchema={{
            required: "قیمت  ضروری است",
          }}
          errors={errors}
        />
        <TextField
          label="مدت زمان"
          name="duration"
          type='number'
          register={register}
          required
          validationSchema={{
            required: "مدت زمان  ضروری است",
          }}
          errors={errors}
        />
        <div className=''>
          {0 ? <Loading /> : (
            <button type="submit" className="btn btn-primary w-full mt-6">
             تایید
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


export default CreateProposal
