import {
  HiDocumentText,
  HiCheckCircle,
  HiWallet,
} from 'react-icons/hi2';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-[6px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F3EE]">
        <Icon className="h-6 w-6 text-karava-green" />
      </div>
      <div>
        <p className="text-sm text-karava-gray-blue">{title}</p>
        <p className="text-lg font-bold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

function FreelancerStats({ proposals = [] }) {
  const numOfProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 2);
  const balance = acceptedProposals.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        icon={HiDocumentText}
        title="درخواست ها"
        value={numOfProposals}
      />
      <StatCard
        icon={HiCheckCircle}
        title="پروژه های تایید شده"
        value={acceptedProposals.length}
      />
      <StatCard
        icon={HiWallet}
        title="کیف پول"
        value={`${toPersianNumbersWithComma(balance)} تومان`}
      />
    </div>
  );
}

export default FreelancerStats;
