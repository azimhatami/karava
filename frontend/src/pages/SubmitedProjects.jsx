import ProjectsHeader from '../features/freelancer/projects/ProjectsHeader';
import ProjectsTable from '../features/freelancer/projects/ProjectsTable';

function SubmitedProjects() {
  return (
    <div className="flex w-full flex-col">
      <ProjectsHeader />
      <ProjectsTable />
    </div>
  );
}

export default SubmitedProjects;
