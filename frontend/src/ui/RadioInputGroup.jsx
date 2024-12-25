import RadioInput from './RadioInput';


function RadioInputGroup({ register, watch, errors, configs }) {

  const { name, validationSchema={}, options } = configs;

  return(
    <>
      <div className='flex items-center justify-center gap-x-8'>
        {options.map(({ value, label }) => {
          return(
            <RadioInput 
              key={value}
              label={label}
              value={value}
              id={value}
              name={name}
              register={register}
              watch={watch}
              validationSchema={validationSchema}
              errors={errors}
            />
          );
        })}    

      </div>
      {errors && errors[name] && (
        <span className='text-error text-sm block text-center'>{errors[name]?.message}</span>
      )}
    </>
  );
}


export default RadioInputGroup
