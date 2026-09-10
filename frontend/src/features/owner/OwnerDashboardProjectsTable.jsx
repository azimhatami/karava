import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ResponsiveTable from '../../ui/ResponsiveTable';
import useOwnerProjects from '../projects/useOwnerProjects';
import OwnerProjectTableRow from './OwnerProjectTableRow';
import { HiOutlineRectangleStack } from 'react-icons/hi2';

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
  const { isLoading, isError, error, refetch, projects } = useOwnerProjects();

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!projects.length) {
    return (
      <Empty
        resourceName="پروژه‌ای"
        title="هنوز پروژه‌ای ثبت نکرده‌اید"
        description="از دکمه «اضافه کردن پروژه» در بالای داشبورد شروع کنید."
        icon={HiOutlineRectangleStack}
        actionLabel="مدیریت پروژه‌ها"
        actionTo="/owner/projects"
      />
    );
  }

  return (
    <section className="flex w-full max-w-[912px] flex-col gap-[7px]">
      <h3 className="owner-panel-title">پروژه های شما</h3>

      <ResponsiveTable
        columns={columns}
        data={projects}
        desktop={
          <div className="flex h-[494px] w-full flex-col overflow-hidden rounded-[6px] border border-karava-green-dark bg-white p-3 [color-scheme:light]">
            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
              <table className="owner-projects-table min-w-[720px] w-full max-w-[886px] border-collapse bg-white">
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
        }
        renderCard={(project) => (
          <OwnerProjectTableRow project={project} variant="card" />
        )}
      />
    </section>
  );
}

export default OwnerDashboardProjectsTable;
