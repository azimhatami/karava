import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import useOwnerProjects from '../projects/useOwnerProjects';
import OwnerProjectTableRow from './OwnerProjectTableRow';

const columns = [
  { key: 'title', label: 'عنوان پروژه', width: '16%' },
  { key: 'category', label: 'دسته بندی', width: '12%' },
  { key: 'budget', label: 'بودجه (تومان)', width: '12%' },
  { key: 'deadline', label: 'ددلاین', width: '10%' },
  { key: 'tags', label: 'تگ ها', width: '10%' },
  { key: 'freelancer', label: 'فریلنسر', width: '12%' },
  { key: 'status', label: 'وضعیت', width: '10%' },
  { key: 'actions', label: 'عملیات', width: '18%' },
];

function OwnerDashboardProjectsTable() {
  const { isLoading, projects } = useOwnerProjects();

  if (isLoading) return <Loading />;
  if (!projects.length) return <Empty resourceName="پروژه‌ای" />;

  return (
    <section className="flex w-full max-w-[912px] flex-col gap-[7px]">
      <h3 className="owner-panel-title">پروژه های شما</h3>

      <div className="flex h-[494px] w-full flex-col overflow-hidden rounded-[6px] border border-karava-green-dark bg-white p-3">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="owner-projects-table w-full max-w-[886px] border-collapse">
            <thead>
              <tr className="owner-projects-table__head-row">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-1 text-center text-xs font-medium leading-[19px] text-karava-gray-blue"
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <OwnerProjectTableRow
                  key={project._id}
                  project={project}
                  isAlternate={index % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboardProjectsTable;
