import useProject from '../features/project/useProject';
import Loading from '../ui/Loading';
import QueryErrorState from '../ui/QueryErrorState';
import Empty from '../ui/Empty';
import ProjectHeader from '../features/project/ProjectHeader';
import ProposalsTable from '../features/project/ProposalsTable';
import ProjectAttachmentsSection from '../ui/ProjectAttachmentsSection';
import ReviewSection from '../features/review/ReviewSection';
import { HiOutlineRectangleStack } from 'react-icons/hi2';

function Project() {
  const { isLoading, isError, error, refetch, project } = useProject();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }

  if (!project) {
    return (
      <Empty
        resourceName="پروژه‌ای"
        title="پروژه یافت نشد"
        description="ممکن است این پروژه حذف شده باشد یا به آن دسترسی نداشته باشید."
        icon={HiOutlineRectangleStack}
        actionLabel="بازگشت به پروژه‌ها"
        actionTo="/owner/projects"
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <div className="rounded-[12px] border border-[#E4E1D6] bg-white p-4">
        <ProjectAttachmentsSection files={project.attachments || []} />
      </div>
      <ProposalsTable proposals={project.proposals || []} />
      <ReviewSection
        project={project}
        canParticipate={project.status === 'COMPLETED'}
      />
    </div>
  );
}

export default Project;
