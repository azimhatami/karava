import { useForm } from 'react-hook-form';
import TextField from '../../ui/TextField';
import Loading from '../../ui/Loading';
import useCreateProposal from './useCreateProposal';


function CreateProposal({ onClose, projectId }) {

  const { register, handleSubmit, formState: {errors} } = useForm();

  const { isCreating, createProposal } = useCreateProposal();

  const onSubmit = (data) => {
    createProposal({...data, projectId}, {
      onSuccess: () => onClose()
    })
  };

  return(
    <div className=''>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
          { isCreating ? <Loading /> : (
            <button type="submit" className="karava-form-submit mt-2">
              تایید و ذخیره
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


export default CreateProposal
