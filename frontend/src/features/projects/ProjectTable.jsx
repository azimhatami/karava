import useOwnerProjects from './useOwnerProjects';


function ProjectTable() {
  const { isLoading, projects } = useOwnerProjects();
  return(
    <>
      ProjectTable
    </>
  );
}


export default ProjectTable
