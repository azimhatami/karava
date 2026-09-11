import Loading from '../../ui/Loading';
import QueryErrorState from '../../ui/QueryErrorState';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import AdminStats from './AdminStats';
import AdminRecentUsers from './AdminRecentUsers';
import useUsers from './useUsers';

function DashboardLayout() {
  const {
    isLoading: isLoadingProposals,
    isError: proposalsError,
    error: proposalsErr,
    refetch: refetchProposals,
    proposals,
  } = useProposals();
  const {
    isLoading: isLoadingProjects,
    isError: projectsError,
    error: projectsErr,
    refetch: refetchProjects,
    projects,
  } = useProjects();
  const {
    isLoading: isLoadingUsers,
    isError: usersError,
    error: usersErr,
    refetch: refetchUsers,
    users,
  } = useUsers();

  if (isLoadingProposals || isLoadingProjects || isLoadingUsers) {
    return <Loading />;
  }

  if (proposalsError || projectsError || usersError) {
    return (
      <QueryErrorState
        error={proposalsErr || projectsErr || usersErr}
        onRetry={() => {
          if (proposalsError) refetchProposals();
          if (projectsError) refetchProjects();
          if (usersError) refetchUsers();
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex w-full flex-col items-stretch gap-[19px] text-right">
        <h2 className="owner-panel-title w-full">
          داشبورد مدیریت سیستم(ادمین)
        </h2>
        <p className="owner-panel-title w-full">
          نظارت بر کلیه کاربران,پروژه ها و درخواست های پلتفرم کارآوا
        </p>
      </div>

      <AdminStats
        users={users.length}
        proposals={proposals.length}
        projects={projects.length}
      />
      <AdminRecentUsers />
    </div>
  );
}

export default DashboardLayout;
