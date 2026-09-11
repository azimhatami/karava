import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ResponsiveTable from '../../ui/ResponsiveTable';
import useOwnerProjects from '../projects/useOwnerProjects';
import OwnerProjectTableRow, {
  OWNER_PROJECT_COLUMNS,
} from './OwnerProjectTableRow';
import { GridTable } from '../../ui/DataTable';
import { HiOutlineRectangleStack } from 'react-icons/hi2';

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
    <section className="flex w-full flex-col gap-3">
      <h3 className="owner-panel-title">پروژه های شما</h3>

      <ResponsiveTable
        columns={OWNER_PROJECT_COLUMNS}
        data={projects}
        desktop={
          <GridTable columns={OWNER_PROJECT_COLUMNS}>
            {projects.map((project) => (
              <OwnerProjectTableRow key={project._id} project={project} />
            ))}
          </GridTable>
        }
        renderCard={(project) => (
          <OwnerProjectTableRow project={project} variant="card" />
        )}
      />
    </section>
  );
}

export default OwnerDashboardProjectsTable;
