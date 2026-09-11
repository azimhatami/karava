import useProjects from '../hooks/useProjects';
import useCategories from '../hooks/useCategories';
import Loading from '../ui/Loading';
import Empty from '../ui/Empty';
import QueryErrorState from '../ui/QueryErrorState';
import HomeHeader from '../features/home/HomeHeader';
import HomeHero from '../features/home/HomeHero';
import HomeFilters from '../features/home/HomeFilters';
import ProjectCard from '../features/home/ProjectCard';
import { toPersianNumbersWithComma } from '../utils/toPersianNumbers';
import { HiOutlineBriefcase } from 'react-icons/hi2';

const footerLinks = ['درباره ما', 'قوانین', 'پشتیبانی', 'تماس'];

function Home() {
  const {
    isLoading: projectsLoading,
    isError,
    error,
    refetch,
    projects,
  } = useProjects();
  const { transformedCategories } = useCategories();

  const openCount = projects.filter(
    (project) => project.status === 'OPEN'
  ).length;
  const totalBudget = projects.reduce(
    (sum, project) => sum + (Number(project.budget) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-ink-paper">
      {/* ink band: header + hero share one dark surface */}
      <div className="bg-ink">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[140px]">
          <HomeHeader />
          <HomeHero
            openCount={openCount}
            categoryCount={transformedCategories.length}
            totalBudget={totalBudget}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-8 xl:px-[140px]">
        <HomeFilters />

        <div className="mb-[22px] mt-10 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[22px] font-black text-ink-text">پروژه‌ها</h2>
            {!projectsLoading && !isError && (
              <span className="text-sm text-ink-muted">
                {toPersianNumbersWithComma(projects.length)} نتیجه
              </span>
            )}
          </div>
          <span className="hidden text-[13.5px] text-ink-muted sm:inline">
            مرتب‌سازی: جدیدترین
          </span>
        </div>

        {projectsLoading ? (
          <div className="flex justify-center py-16">
            <Loading />
          </div>
        ) : isError ? (
          <QueryErrorState error={error} onRetry={refetch} />
        ) : !projects.length ? (
          <Empty
            resourceName="پروژه‌ای"
            title="پروژه‌ای با این فیلترها پیدا نشد"
            description="عبارت جستجو یا دسته‌بندی را تغییر دهید."
            icon={HiOutlineBriefcase}
          />
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      <footer className="bg-ink">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-6 px-4 py-11 md:flex-row md:px-8 xl:px-[140px]">
          <div className="flex items-baseline gap-2.5">
            <span className="font-['Sora',_sans-serif] text-[15px] font-bold tracking-[0.14em] text-ink-mint">
              KARAVA
            </span>
            <span className="text-[13px] text-ink-dim">
              سامانه کاریابی و مدیریت پروژه
            </span>
          </div>
          <nav className="flex items-center gap-6 text-[13px] text-ink-dim">
            {footerLinks.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default Home;
