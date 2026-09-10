import useProjects from '../hooks/useProjects';
import Loading from '../ui/Loading';
import Empty from '../ui/Empty';
import QueryErrorState from '../ui/QueryErrorState';
import HomeHeader from '../features/home/HomeHeader';
import HomeHero from '../features/home/HomeHero';
import HomeFilters from '../features/home/HomeFilters';
import ProjectCard from '../features/home/ProjectCard';
import { HiOutlineBriefcase } from 'react-icons/hi2';

function Home() {
  const {
    isLoading: projectsLoading,
    isError,
    error,
    refetch,
    projects,
  } = useProjects();

  return (
    <div className="min-h-screen bg-karava-bg-subtle">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
        <HomeHeader />
        <HomeHero />
        <HomeFilters />

        {projectsLoading ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : isError ? (
          <QueryErrorState error={error} onRetry={refetch} />
        ) : !projects.length ? (
          <Empty
            resourceName="پروژه‌ای"
            title="پروژه‌ای یافت نشد"
            description="با تغییر فیلترها یا کمی بعد دوباره امتحان کنید."
            icon={HiOutlineBriefcase}
          />
        ) : (
          <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
