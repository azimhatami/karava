import { useSearchParams } from "react-router";
import Select from './Select';


function FilterDropDown({ options, filterField }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(filterField) || '';

  function handleChange(event) {
    searchParams.set(filterField, event.target.value);
    setSearchParams(searchParams);
  }

  return(
    <>
      <Select value={value} onChange={handleChange} options={options} />
    </>
  );
}


export default FilterDropDown
