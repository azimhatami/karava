import Loading from '../../ui/Loading';
import QueryErrorState from '../../ui/QueryErrorState';
import useProposals from '../proposals/useProposals';
import useProjects from '../../hooks/useProjects';
import useUser from '../authentication/useUser';
import FreelancerStats from './FreelancerStats';
import FreelancerDashboardProjects from './FreelancerDashboardProjects';
import ProfileCompletionCard from '../profile/ProfileCompletionCard';

function DashboardLayout() {
  const { user } = useUser();
  const {
    isLoading: proposalsLoading,
    isError: proposalsError,
    error: proposalsErr,
    refetch: refetchProposals,
    proposals,
  } = useProposals();
  const {
    isLoading: projectsLoading,
    isError: projectsError,
    error: projectsErr,
    refetch: refetchProjects,
    projects,
  } = useProjects();

  if (proposalsLoading || projectsLoading) return <Loading />;

  if (proposalsError || projectsError) {
    return (
      <QueryErrorState
        error={proposalsErr || projectsErr}
        onRetry={() => {
          if (proposalsError) refetchProposals();
          if (projectsError) refetchProjects();
        }}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex min-h-[77px] w-full shrink-0 flex-col gap-2.5 p-2.5">
        <h2 className="w-full text-right text-base font-bold leading-none text-[#222020]">
          داشبورد فریلنسر
        </h2>
        <p className="w-full text-right text-sm font-bold leading-6 text-[#222020] md:text-base md:leading-none">
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
