import {
  HiDocumentText,
  HiCheckCircle,
  HiFolderOpen,
} from 'react-icons/hi2';

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="flex h-[68px] w-[288px] max-w-full flex-col justify-center gap-2.5 rounded-[6px] border border-karava-green bg-white p-2.5">
      <div className="flex w-full items-center justify-between gap-2">
        <Icon className="h-5 w-5 shrink-0 text-karava-green" />
        <span className="text-base font-bold leading-[19px] text-black">{title}</span>
      </div>
      <p className="w-full text-right text-base font-bold leading-[19px] text-black">
        {value}
      </p>
    </div>
  );
}

function AdminStats({ users = 0, proposals = 0, projects = 0 }) {
  return (
    <div className="flex flex-wrap gap-4">
      <StatCard icon={HiDocumentText} title="کاربران" value={users} />
      <StatCard icon={HiCheckCircle} title="درخواست ها" value={proposals} />
      <StatCard icon={HiFolderOpen} title="پروژه" value={projects} />
    </div>
  );
}

export default AdminStats;
