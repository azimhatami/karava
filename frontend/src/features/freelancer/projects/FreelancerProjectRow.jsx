import { Link } from 'react-router-dom';
import { HiOutlineEye } from 'react-icons/hi2';
import shortDate from '../../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../../utils/toPersianNumbers';
import {
  DataCard,
  GridRow,
  Money,
  PrimaryCell,
} from '../../../ui/DataTable';

export const FREELANCER_PROJECT_COLUMNS = [
  { key: 'project', label: 'پروژه', width: 'minmax(0, 2.6fr)' },
  { key: 'budget', label: 'بودجه', width: '1.1fr' },
  { key: 'deadline', label: 'ددلاین', width: '1fr' },
  { key: 'actions', label: '', width: '130px', align: 'end' },
];

const STATUS_KEY = { OPEN: 'open', CLOSED: 'closed', COMPLETED: 'completed' };

function FreelancerProjectRow({ project, variant = 'desktop' }) {
  const { status, title, budget, deadline } = project;
  const statusKey = STATUS_KEY[status] || 'closed';

  const meta = [
    project.category?.title,
    project.owner?.name ? `کارفرما: ${project.owner.name}` : null,
    project.owner?.totalReviews
      ? `${project.owner.averageRating} از ${project.owner.totalReviews} نظر`
      : null,
  ].filter(Boolean);

  const actions = (
    <Link
      to={`/projects/${project._id}`}
      className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-ink-line px-3.5 text-[12.5px] font-bold text-ink-muted transition-colors hover:bg-ink-well hover:text-ink-text"
    >
      <HiOutlineEye className="h-4 w-4" />
      مشاهده
    </Link>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={title}
        status={statusKey}
        meta={meta}
        stats={[
          {
            label: 'بودجه (تومان)',
            value: toPersianNumbersWithComma(budget || 0),
          },
          {
            label: 'ددلاین',
            value: deadline ? shortDate(deadline) : '—',
          },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <GridRow columns={FREELANCER_PROJECT_COLUMNS}>
      <PrimaryCell title={title} status={statusKey} meta={meta} />
      <Money amount={budget} />
      <span className="text-[13px] text-ink-body">
        {deadline ? shortDate(deadline) : '—'}
      </span>
      <div className="flex items-center justify-end">{actions}</div>
    </GridRow>
  );
}

export default FreelancerProjectRow;
