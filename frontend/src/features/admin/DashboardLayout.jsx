import DashboardHeader from '../../ui/DashboardHeader';
import Loading from '../../ui/Loading';
import useProposals from '../proposals/useProposals';


function DashboardLayout() {

  const { isLoading, proposals } = useProposals();

  if (isLoading) return <Loading />;

  return(
    <>
      <DashboardHeader />
      {/*<Stats proposals={proposals} />*/}
    </>
  );
}


export default DashboardLayout
