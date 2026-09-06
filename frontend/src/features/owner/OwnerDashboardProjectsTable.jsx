import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import useOwnerProjects from '../projects/useOwnerProjects';
import OwnerProjectTableRow from './OwnerProjectTableRow';

const OWNER_PROJECTS_GRID_COLS =
  'grid-cols-[minmax(0,1.5fr)_0.9fr_1fr_0.8fr_1.1fr_0.9fr_0.8fr_1.1fr]';

const columns = [
  { key: 'title', label: 'عنوان پروژه' },
  { key: 'category', label: 'دسته بندی' },
  { key: 'budget', label: 'بودجه (تومان)' },
  { key: 'deadline', label: 'ددلاین' },
  { key: 'tags', label: 'تگ ها' },
  { key: 'freelancer', label: 'فریلنسر' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
];

function OwnerDashboardProjectsTable() {
  const { isLoading, projects } = useOwnerProjects();

  if (isLoading) return <Loading />;
  if (!projects.length) return <Empty resourceName="پروژه‌ای" />;

  return (
    <section className="flex w-full rotate-0 flex-col gap-[7px] opacity-100">
      <h3 className="owner-panel-title w-full">پروژه های شما</h3>

      <div className="flex h-[494px] w-full rotate-0 flex-col overflow-hidden rounded-[6px] border border-[#245A49] bg-white p-3 opacity-100">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto">
          <div
            className={`grid h-[19px] w-full shrink-0 rotate-0 items-center ${OWNER_PROJECTS_GRID_COLS} opacity-100`}
          >
            {columns.map((column) => (
              <span
                key={column.key}
                className="h-[19px] rotate-0 whitespace-nowrap text-center font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100"
              >
                {column.label}
              </span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {projects.map((project) => (
              <OwnerProjectTableRow key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboardProjectsTable;
