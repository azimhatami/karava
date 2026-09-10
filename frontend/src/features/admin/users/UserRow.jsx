import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import Modal from '../../../ui/Modal';
import ChangeUserStatus from './ChangeUserStatus';
import truncateText from '../../../utils/truncateText';
import { MobileDataCard } from '../../../ui/ResponsiveTable';

const USERS_GRID_COLS =
  'grid-cols-[1.1fr_1.6fr_1.1fr_0.9fr_1fr_0.8fr]';

const userStatus = [
  {
    label: 'رد شده',
    className: 'border border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]',
  },
  {
    label: 'در انتظار تایید',
    className: 'bg-[#E5E7EB] text-[#374151]',
  },
  {
    label: 'تایید شده',
    className: 'bg-karava-green text-white',
  },
];

function UserRow({ user, variant = 'desktop' }) {
  const { status } = user;
  const [open, setOpen] = useState(false);
  const statusMeta = userStatus[status] || userStatus[1];

  const statusBadge = (
    <span
      className={`inline-flex min-w-[7.5rem] items-center justify-center rounded-[4px] px-2 py-0.5 text-center text-xs font-medium ${statusMeta.className}`}
    >
      {statusMeta.label}
    </span>
  );

  const actions = (
    <>
      <Modal
        title="تغییر وضعیت درخواست"
        open={open}
        onClose={() => setOpen(false)}
      >
        <ChangeUserStatus userId={user._id} onClose={() => setOpen(false)} />
      </Modal>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="تغییر وضعیت"
        className="inline-flex h-8 w-8 items-center justify-center"
      >
        <MdEdit className="h-5 w-5 text-[#006045]" />
      </button>
    </>
  );

  if (variant === 'card') {
    return (
      <MobileDataCard
        title={user.name || 'کاربر بدون نام'}
        fields={[
          {
            key: 'email',
            label: 'ایمیل',
            value: user.email || '—',
          },
          {
            key: 'phone',
            label: 'شماره موبایل',
            value: user.phoneNumber || '—',
          },
          { key: 'role', label: 'نقش', value: user.role || '—' },
          { key: 'status', label: 'وضعیت', value: statusBadge },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <div
      className={`box-border grid h-[68px] w-full shrink-0 items-center border-b border-[#000000] px-1 py-[19px] transition-colors hover:bg-[#F2FFF8] ${USERS_GRID_COLS}`}
    >
      <span className="min-w-0 truncate text-center text-sm text-[#374151]">
        {user.name || '-'}
      </span>
      <span className="min-w-0 truncate text-center text-sm text-[#374151]">
        {truncateText(user.email || '-', 28)}
      </span>
      <span className="text-center text-sm text-[#374151]">
        {user.phoneNumber || '-'}
      </span>
      <span className="text-center text-sm text-[#374151]">{user.role}</span>
      <div className="flex items-center justify-center">{statusBadge}</div>
      <div className="flex items-center justify-center">{actions}</div>
    </div>
  );
}

export default UserRow;
export { USERS_GRID_COLS };
