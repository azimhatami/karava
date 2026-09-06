import { Link } from 'react-router-dom';
import ProjectCard from '../home/ProjectCard';

function FreelancerDashboardProjects({ projects = [] }) {
  const openProjects = projects.filter((p) => p.status === 'OPEN').slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
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

      <div className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3">
        {openProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default FreelancerDashboardProjects;
