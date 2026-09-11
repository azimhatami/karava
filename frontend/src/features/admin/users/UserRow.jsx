import { useState } from 'react';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Modal from '../../../ui/Modal';
import ChangeUserStatus from './ChangeUserStatus';
import truncateText from '../../../utils/truncateText';
import { toPersianNumbers } from '../../../utils/toPersianNumbers';
import { Avatar, DataCard, IconAction, StatusChip } from '../../../ui/DataTable';

/* Design B (dense): the admin list is the one table that grows to hundreds of
 * rows, so it keeps every column and trades breathing room for scan speed. */
export const USER_COLUMNS = [
  { key: 'name', label: 'کاربر' },
  { key: 'email', label: 'ایمیل' },
  { key: 'phone', label: 'شماره موبایل' },
  { key: 'role', label: 'نقش' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: '' },
];

/** user.status: 0 rejected · 1 pending · 2 approved */
const STATUS = [
  { key: 'rejected', label: 'رد شده' },
  { key: 'pending', label: 'در انتظار تایید' },
  { key: 'accepted', label: 'تایید شده' },
];

const ROLE_LABELS = {
  OWNER: 'کارفرما',
  FREELANCER: 'کارجو',
  ADMIN: 'مدیر سیستم',
};

function UserRow({ user, variant = 'desktop' }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS[user.status] || STATUS[1];
  const roleLabel = ROLE_LABELS[user.role] || user.role || '—';

  const actions = (
    <>
      <Modal
        title="تغییر وضعیت درخواست"
        open={open}
        onClose={() => setOpen(false)}
      >
        <ChangeUserStatus userId={user._id} onClose={() => setOpen(false)} />
      </Modal>
      <IconAction
        icon={HiOutlinePencilSquare}
        label="تغییر وضعیت کاربر"
        onClick={() => setOpen(true)}
      />
    </>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={user.name || 'کاربر بدون نام'}
        status={meta.key}
        statusLabel={meta.label}
        meta={[roleLabel]}
        stats={[
          {
            label: 'ایمیل',
            value: (
              <span dir="ltr" className="block truncate text-left">
                {user.email || '—'}
              </span>
            ),
          },
          {
            label: 'شماره موبایل',
            value: user.phoneNumber ? toPersianNumbers(user.phoneNumber) : '—',
          },
        ]}
        actions={actions}
      />
    );
  }

  return (
    <tr className="border-b border-[#F6F4EE] transition-colors last:border-b-0 hover:bg-ink-mint-tint/40">
      <td className="whitespace-nowrap px-4 py-0">
        <span className="flex h-12 items-center gap-2.5">
          <Avatar name={user.name} className="h-8 w-8 rounded-lg text-[12px]" />
          <span className="truncate text-[13px] font-bold text-ink-text">
            {user.name || '—'}
          </span>
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-0 text-[13px] text-ink-body">
        {truncateText(user.email || '—', 28)}
      </td>
      <td
        dir="ltr"
        className="whitespace-nowrap px-4 py-0 text-right font-['Sora',_sans-serif] text-[12.5px] text-ink-body"
      >
        {user.phoneNumber || '—'}
      </td>
      <td className="whitespace-nowrap px-4 py-0 text-[13px] text-ink-body">
        {roleLabel}
      </td>
      <td className="whitespace-nowrap px-4 py-0">
        <StatusChip status={meta.key} label={meta.label} size="sm" />
      </td>
      <td className="whitespace-nowrap px-4 py-0">
        <span className="flex justify-end">{actions}</span>
      </td>
    </tr>
  );
}

export default UserRow;
