import useProject from '../features/project/useProject';
import Loading from '../ui/Loading';
import ProjectHeader from '../features/project/ProjectHeader';
import ProposalsTable from '../features/project/ProposalsTable';
import ProjectAttachmentsSection from '../ui/ProjectAttachmentsSection';
import ReviewSection from '../features/review/ReviewSection';

function Project() {
  const { isLoading, project } = useProject();

  if (isLoading) {
    return <Loading />;
  }

  if (!project) {
    return <p className="font-bold text-secondary-700">پروژه یافت نشد</p>;
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />
      <div className="rounded-[12px] border border-[#D1D5DB] bg-white p-4">
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
