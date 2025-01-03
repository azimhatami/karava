function Select({ value, onChange, options }) {
  return(
    <>
      <select 
        vlue={value} 
        onChange={onChange} 
        className='textField_input py-2 text-xs bg-secondary-0'
      >
        {
          options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)
        } 
      </select>
    </>
  );
}


export default Select
