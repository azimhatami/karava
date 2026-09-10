import { Link } from 'react-router-dom';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import useUsers from './useUsers';
import { HiOutlineUsers } from 'react-icons/hi2';

const roleLabels = {
  ADMIN: 'Admin',
  FREELANCER: 'Freelancer',
  OWNER: 'Owner',
};

const statusLabels = {
  0: 'رد شده',
  1: 'در انتظار تایید',
  2: 'تایید شده',
};

function AdminUserListRow({ user }) {
  const isApproved = Number(user.status) === 2;

  return (
    <div className="flex h-[79px] w-full items-center justify-between border-b border-black px-1 py-1">
      <div className="flex min-w-0 flex-col items-start gap-[9px] text-right">
        <p className="truncate text-base font-bold leading-[19px] text-karava-text">
          {user.name || '-'}
        </p>
        <p className="truncate text-xs font-bold leading-[15px] text-karava-text">
          {user.email || user.phoneNumber || '-'}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[23px]">
        <span className="rounded-[6px] bg-karava-green-light/30 px-1 py-1 text-sm font-bold leading-[17px] text-karava-green">
          {isApproved ? 'تاییدشده' : statusLabels[user.status] || 'نامشخص'}
        </span>
        <span className="rounded-[6px] bg-karava-bg-subtle px-1 py-1 text-sm font-bold leading-[17px] text-karava-gray-blue">
          {roleLabels[user.role] || user.role}
        </span>
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
        <h3 className="text-xl font-bold leading-6 text-karava-text">
          آخرین کاربران ثبت شده
        </h3>
        <Link
          to="/admin/users"
          className="text-base font-bold leading-[19px] text-karava-green hover:text-karava-green-dark"
        >
          مشاهده همه کاربران
        </Link>
      </div>

      <div className="flex w-full flex-col gap-[22px] overflow-x-auto bg-white p-2.5">
        {recentUsers.map((user) => (
          <AdminUserListRow key={user._id} user={user} />
        ))}
      </div>
    </section>
  );
}

export default AdminRecentUsers;
