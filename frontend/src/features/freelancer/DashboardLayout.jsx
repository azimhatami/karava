import Loading from '../../ui/Loading';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import useUser from '../authentication/useUser';
import FreelancerStats from './FreelancerStats';
import FreelancerDashboardProjects from './FreelancerDashboardProjects';

function DashboardLayout() {
  const { user } = useUser();
  const { isLoading: proposalsLoading, proposals } = useProposals();
  const { isLoading: projectsLoading, projects } = useProjects();

  if (proposalsLoading || projectsLoading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">داشبورد فریلنسر</h2>
        <p className="mt-2 text-sm text-[#6B7280]">
          خوش آمدید {user?.name || 'کاربر'}! وضعیت درخواست ها، درآمد و پروژه
          های مناسب
        </p>
      </div>

      <FreelancerStats proposals={proposals} />
      <FreelancerDashboardProjects projects={projects} />
    </div>
  );
}

export default DashboardLayout;
