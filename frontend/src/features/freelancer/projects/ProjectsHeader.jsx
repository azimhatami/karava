import FilterDropDown from '../../../ui/FilterDropDown';
import Filter from '../../../ui/Filter';
import useCategories from '../../../hooks/useCategories';

const sortOptions = [
  {
    label: 'مرتب سازی (جدیدترین)',
    value: 'latest',
  },
  {
    label: 'مرتب سازی (قدیمی ترین)',
    value: 'earliest',
  },
];

const statusOptions = [
  {
    label: 'همه',
    value: 'ALL',
  },
  {
    label: 'باز',
    value: 'OPEN',
  },
  {
    label: 'بسته',
    value: 'CLOSED',
  },
];

function ProjectsHeader() {
  const { transformedCategories } = useCategories();

  return (
    <div className="mb-6 flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h2 className="owner-panel-title shrink-0 whitespace-nowrap">
        لیست پروژه ها
      </h2>

      <div className="flex min-w-0 flex-wrap items-center justify-start gap-3 sm:justify-end">
        <Filter filterField="status" options={statusOptions} />
        <FilterDropDown filterField="sort" options={sortOptions} />
        <FilterDropDown
          filterField="category"
          options={[
            {
              value: 'ALL',
              label: 'دسته بندی (همه)',
            },
            ...transformedCategories,
          ]}
        />
      </div>
    </div>
  );
}

export default ProjectsHeader;
