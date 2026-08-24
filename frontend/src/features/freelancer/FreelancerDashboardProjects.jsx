import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import CreateProposal from '../proposals/CreateProposal';

function FreelancerDashboardProjectCard({ project }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="flex h-full flex-col rounded-[6px] border border-[#E5E7EB] bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-right text-sm font-bold leading-6 text-[#111827]">
          {project.title}
        </h3>
        <p className="shrink-0 text-sm font-bold text-karava-green">
          {toPersianNumbersWithComma(project.budget || 0)} تومان
        </p>
      </div>

      <p className="mb-4 flex-1 text-sm leading-6 text-karava-gray-blue">
        {truncateText(project.description || '', 120)}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {(project.tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-[#4ADE80] px-2 py-0.5 text-xs text-white"
          >
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-white" />
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-[6px] bg-karava-green px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
      >
        ارسال درخواست
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`درخواست انجام پروژه ${project.title}`}
      >
        <CreateProposal onClose={() => setOpen(false)} projectId={project._id} />
      </Modal>
    </article>
  );
}

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {openProjects.map((project) => (
          <FreelancerDashboardProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default FreelancerDashboardProjects;
