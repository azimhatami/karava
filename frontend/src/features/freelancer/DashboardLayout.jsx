import Loading from '../../ui/Loading';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import useUser from '../authentication/useUser';
import FreelancerStats from './FreelancerStats';
import FreelancerDashboardProjects from './FreelancerDashboardProjects';
import ProfileCompletionCard from '../profile/ProfileCompletionCard';

function DashboardLayout() {
  const { user } = useUser();
  const { isLoading: proposalsLoading, proposals } = useProposals();
  const { isLoading: projectsLoading, projects } = useProjects();

  if (proposalsLoading || projectsLoading) return <Loading />;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex h-[77px] w-full shrink-0 rotate-0 flex-col gap-2.5 p-2.5 opacity-100">
        <h2 className="h-[19px] w-full rotate-0 text-right font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100">
          داشبورد فریلنسر
        </h2>
        <p className="h-[19px] w-full rotate-0 whitespace-nowrap text-right font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100">
          خوش آمدید {user?.name || 'کاربر'}! وضعیت درخواست ها، درآمد و پروژه
          های مناسب
        </p>
      </div>

      <ProfileCompletionCard user={user} profilePath="/freelancer/profile" />

      <div className="w-full shrink-0">
        <FreelancerStats proposals={proposals} />
      </div>
      <FreelancerDashboardProjects projects={projects} />
    </div>
  );
}

export default DashboardLayout;
