import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
} from 'react-icons/hi';

function StatCardIcon({ icon: Icon }) {
  return (
    <Icon
      className="h-[22px] w-[22px] shrink-0 text-[#006045]"
      aria-hidden
    />
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="flex h-[68px] w-[288px] max-w-full flex-col justify-center gap-2.5 rounded-[6px] border border-karava-green bg-white p-2.5">
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-base font-bold leading-[19px] text-karava-text">{title}</span>
        <StatCardIcon icon={icon} />
      </div>
      <p className="w-full text-right text-base font-bold leading-[19px] text-karava-text">
        {value}
      </p>
    </div>
  );
}

function OwnerStats({ projects = [] }) {
  const numOfProjects = projects.length;
  const assignedProjects = projects.filter((p) => p.freelancer).length;
  const numOfProposals = projects.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.proposals?.length || 0),
    0,
  );

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard icon={HiOutlineDocumentText} title="درخواست ها" value={numOfProposals} />
      <StatCard
        icon={HiOutlineCheckCircle}
        title="پروژه های واگذار شده"
        value={assignedProjects}
      />
      <StatCard icon={HiOutlineBriefcase} title="پروژه" value={numOfProjects} />
    </div>
  );
}

export default OwnerStats;
