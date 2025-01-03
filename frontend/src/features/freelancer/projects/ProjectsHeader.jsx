import FilterDropDown from '../../../ui/FilterDropDown';
import useCategories from '../../../hooks/useCategories';


function ProjectsHeader() {
  const { transformedCategories } = useCategories()
  return(
    <div className='flex items-center justify-between text-secondary-700 mb-8'>
      <h2 className='text-lg font-bold'>لیست پروژه ها</h2>
      <div>
        <FilterDropDown 
          filterField='category' 
          options={[
            {
              value: 'ALL', 
              label: 'دسته بندی (همه)'
            }, 
            ...transformedCategories
          ]} 
        />
      </div>
    </div>
  );
}


export default ProjectsHeader
