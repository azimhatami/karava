function Select({ value, onChange, options }) {
  return(
    <>
      <select 
        vlue={value} 
        onChange={onChange} 
        className="textField_input w-auto min-w-0 shrink-0 whitespace-nowrap bg-secondary-0 py-2 text-xs"
      >
        {
          options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)
        } 
      </select>
    </>
  );
}


export default Select
