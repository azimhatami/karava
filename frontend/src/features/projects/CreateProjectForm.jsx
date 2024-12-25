import { useForm } from 'react-hook-form';
import TextField from '../../ui/TextField';


function CreateProjectForm() {

  const { 
    register,
    formState: { errors },
    handleSubmit
  } = useForm();

  const onSubmit = (data) => {
    console.log(data)
  };

  return(
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <TextField 
        label='عنوان'
        name='title'
        register={register}
        required
        validationSchema={{
          required: 'عنوان ضروری است',
          minLength: {
            value: 10,
            message: 'حداقل ۱۰ کاراکتر وارد کنید',
          }
        }}
        errors={errors}
      />
      <TextField 
        label='توضیحات'
        name='title'
        register={register}
        required
        validationSchema={{
          required: 'توضیحات ضروری است',
          minLength: {
            value: 10,
            message: 'حداقل ۱۰ کاراکتر وارد کنید',
          }
        }}
        errors={errors}
      />
      <TextField 
        label='بودجه'
        name='title'
        register={register}
        required
        validationSchema={{
          required: 'بودجه ضروری است',
        }}
        errors={errors}
      />
      <button type='submit' className='btn btn-primary w-full'>تایید</button>
    </form>
  );
}


export default CreateProjectForm
