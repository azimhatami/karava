function RadioInput({
  label, 
  name, 
  id, 
  value, 
  register,
  validationSchema,
  errors,
  watch
}) {
  return(
    <>
      <div className='flex items-center gap-x-2 text-secondary-700'>
        <input 
          className='w-4 h-4 cursor-pointer form-radio text-primary-900 focus:ring-primary-900'
          type='radio' 
          name={name} 
          id={id} 
          value={value}
          {...register(name, validationSchema)}
          checked={watch(name) === value}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </>
  );
}


export default RadioInput;
