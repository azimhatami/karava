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
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3EE] text-karava-green">
        <Icon className="h-7 w-7" />
      </span>
      <div className="space-y-1.5">
        <p className="text-sm font-bold text-karava-text">{heading}</p>
        {description ? (
          <p className="max-w-sm text-xs leading-5 text-karava-gray">{description}</p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="mt-1 inline-flex h-10 items-center justify-center rounded-[6px] bg-karava-green px-4 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
        >
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction && !actionTo ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 inline-flex h-10 items-center justify-center rounded-[6px] bg-karava-green px-4 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default Empty;
