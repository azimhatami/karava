import Loading from '../../ui/Loading';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import AdminStats from './AdminStats';
import AdminRecentUsers from './AdminRecentUsers';
import useUsers from './useUsers';

function DashboardLayout() {
  const { isLoading: isLoadingProposals, proposals } = useProposals();
  const { isLoading: isLoadingProjects, projects } = useProjects();
  const { isLoading: isLoadingUsers, users } = useUsers();

  if (isLoadingProposals || isLoadingProjects || isLoadingUsers) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="flex max-w-[912px] flex-col items-end gap-[19px] text-right">
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
