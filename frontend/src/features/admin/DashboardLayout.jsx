import DashboardHeader from '../../ui/DashboardHeader';
import Loading from '../../ui/Loading';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import Stats from './Stats';
import useUsers from './useUsers';


function DashboardLayout() {

  const { isLoading: isLoadingProposals, proposals } = useProposals();
  const { isLoading: isLoadingProjects, projects } = useProjects();
  const { isLoading: isLoadingUsers, users } = useUsers();

  if (isLoadingProposals || isLoadingProjects || isLoadingUsers) return <Loading />;

  return(
    <>
      <DashboardHeader />
      <Stats proposals={proposals.length} projects={projects.length} users={users.length} />
    </>
  );
}


export default DashboardLayout
