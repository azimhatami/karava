import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineBriefcase,
  HiOutlineLockClosed,
} from 'react-icons/hi2';
import StatCard, { StatGrid } from '../../ui/StatCard';

function OwnerStats({ projects = [] }) {
  const numOfProjects = projects.length;
  const assignedProjects = projects.filter((p) => p.freelancer).length;
  const numOfProposals = projects.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.proposals?.length || 0),
    0,
  );
  const heldAmount = projects
    .filter((p) => p.escrowStatus === 'held')
    .reduce((sum, p) => sum + (Number(p.escrowAmount) || 0), 0);

  return (
    <StatGrid columns={4}>
      <StatCard icon={HiOutlineBriefcase} title="پروژه" value={numOfProjects} />
      <StatCard
        icon={HiOutlineDocumentText}
        title="درخواست ها"
        value={numOfProposals}
      />
      <StatCard
        icon={HiOutlineCheckCircle}
        title="پروژه های واگذار شده"
        value={assignedProjects}
      />
      <StatCard
        icon={HiOutlineLockClosed}
        title="در امانت"
        value={heldAmount}
        note="تا تحویل کار بلوکه است"
        tone={heldAmount ? 'amber' : 'plain'}
      />
    </StatGrid>
  );
}

export default OwnerStats;
