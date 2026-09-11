import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineWallet,
} from 'react-icons/hi2';
import StatCard, { StatGrid } from '../../ui/StatCard';

function FreelancerStats({ proposals = [] }) {
  const numOfProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 2);
  const earned = acceptedProposals.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  return (
    <StatGrid>
      <StatCard
        icon={HiOutlineDocumentText}
        title="درخواست ها"
        value={numOfProposals}
      />
      <StatCard
        icon={HiOutlineCheckCircle}
        title="پروژه های تایید شده"
        value={acceptedProposals.length}
      />
      <StatCard
        icon={HiOutlineWallet}
        title="مجموع پیشنهادهای پذیرفته‌شده"
        value={earned}
        note="تومان"
        tone="ink"
      />
    </StatGrid>
  );
}

export default FreelancerStats;
