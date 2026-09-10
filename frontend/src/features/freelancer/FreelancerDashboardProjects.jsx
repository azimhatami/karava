import { Link } from 'react-router-dom';
import ProjectCard from '../home/ProjectCard';
import Empty from '../../ui/Empty';
import { HiOutlineBriefcase } from 'react-icons/hi2';

function FreelancerDashboardProjects({ projects = [] }) {
  const openProjects = projects.filter((p) => p.status === 'OPEN').slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[#111827]">
          پروژه‌های باز و پیشنهادی
        </h3>
        <Link
          to="/freelancer/projects"
          className="text-sm font-medium text-karava-green hover:text-karava-green-dark"
        >
          مشاهده همه
        </Link>
      </div>

      {!openProjects.length ? (
        <Empty
          resourceName="پروژه‌ای"
          title="فعلاً پروژه بازی وجود ندارد"
          description="به محض انتشار پروژه جدید، فرصت‌های شغلی اینجا نمایش داده می‌شوند."
          icon={HiOutlineBriefcase}
          actionLabel="مشاهده همه پروژه‌ها"
          actionTo="/freelancer/projects"
        />
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
          {openProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FreelancerDashboardProjects;
