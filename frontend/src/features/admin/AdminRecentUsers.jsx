import { Link } from 'react-router-dom';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import useUsers from './useUsers';
import { HiOutlineUsers } from 'react-icons/hi2';
import { Avatar, StatusChip } from '../../ui/DataTable';

const roleLabels = {
  ADMIN: 'مدیر سیستم',
  FREELANCER: 'کارجو',
  OWNER: 'کارفرما',
};

const statusMeta = {
  0: { status: 'rejected', label: 'رد شده' },
  1: { status: 'pending', label: 'در انتظار تایید' },
  2: { status: 'accepted', label: 'تایید شده' },
};

function AdminUserListRow({ user }) {
  const meta = statusMeta[Number(user.status)] || statusMeta[1];

  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-ink-hair px-5 py-4 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={user.name} className="h-9 w-9 rounded-lg text-[12px]" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold text-ink-text">
            {user.name || 'کاربر بدون نام'}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-ink-muted">
            {user.email || user.phoneNumber || '—'}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <span className="hidden text-[12.5px] text-ink-dim sm:inline">
          {roleLabels[user.role] || user.role}
        </span>
        <StatusChip status={meta.status} label={meta.label} size="sm" />
      </div>
    </div>
  );
}

function AdminRecentUsers() {
  const { isLoading, isError, error, refetch, users } = useUsers();

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!users.length) {
    return (
      <Empty
        resourceName="کاربری"
        title="هنوز کاربری ثبت نشده است"
        icon={HiOutlineUsers}
      />
    );
  }

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="w-full">
      <div className="mb-[22px] flex w-full flex-wrap items-center justify-between gap-2">
        <h3 className="text-[19px] font-black text-ink-text">
          آخرین کاربران ثبت شده
        </h3>
        <Link
          to="/admin/users"
          className="text-[13px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
        >
          مشاهده همه کاربران
        </Link>
      </div>

      <div className="ink-card flex w-full flex-col overflow-hidden">
        {recentUsers.map((user) => (
          <AdminUserListRow key={user._id} user={user} />
        ))}
      </div>
    </section>
  );
}

export default AdminRecentUsers;
