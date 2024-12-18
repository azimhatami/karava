function RadioInput({label, name, id, value, onChange, checked}) {
  return(
    <>
      <div className='flex items-center gap-x-2 text-secondary-700'>
        <input 
          className='w-4 h-4 cursor-pointer form-radio text-primary-900 focus:ring-primary-900'
          type='radio' 
          name={name} 
          id={id} 
          value={value}
          onChange={onChange}
          checked={checked}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </>
  );
}


export default RadioInput;
