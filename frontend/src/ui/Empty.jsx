import { Link } from 'react-router-dom';
import { HiOutlineInbox } from 'react-icons/hi2';

function Empty({
  resourceName = 'موردی',
  title,
  description,
  icon: Icon = HiOutlineInbox,
  actionLabel,
  actionTo,
  onAction,
}) {
  const heading = title || `هنوز ${resourceName} ثبت نشده است`;

  return (
    <div className="flex flex-col items-center justify-center gap-3.5 rounded-2xl border border-dashed border-ink-line bg-ink-card px-4 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-mint-tint text-ink-mint-deep">
        <Icon className="h-7 w-7" />
      </span>
      <div className="space-y-1.5">
        <p className="text-[15px] font-bold text-ink-text">{heading}</p>
        {description ? (
          <p className="max-w-sm text-[13px] leading-6 text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="ink-btn-primary mt-1"
        >
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction && !actionTo ? (
        <button
          type="button"
          onClick={onAction}
          className="ink-btn-primary mt-1"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default Empty;
