function RHFSelect({ label, name, register, options, required }) {
  return(
    <>
      <label 
        htmlFor={name}
        className='mb-2 block text-secondary-700'
      >
        {label}
        {required && <span className='text-error'>*</span>}
      </label>
      <select 
        {...register(name)} 
        id={name} 
        className='textField_input'
      >
        {options.map((option) => {
          return(
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}        
      </select>
    </>
  );
}


export default RHFSelect
