import { Link } from 'react-router-dom';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import useUsers from './useUsers';

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
      <div className="flex flex-col items-start gap-[9px] text-right">
        <p className="text-base font-bold leading-[19px] text-karava-text">
          {user.name || '-'}
        </p>
        <p className="text-xs font-bold leading-[15px] text-karava-text">
          {user.email || user.phoneNumber || '-'}
        </p>
      </div>

      <div className="flex items-center gap-[23px]">
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
  const { isLoading, users } = useUsers();

  if (isLoading) return <Loading />;
  if (!users.length) return <Empty resourceName="کاربر" />;

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="w-full">
      <div className="mb-[22px] flex w-full items-center justify-between">
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

      <div className="flex w-full flex-col gap-[22px] bg-white p-2.5">
        {recentUsers.map((user) => (
          <AdminUserListRow key={user._id} user={user} />
        ))}
      </div>
    </section>
  );
}

export default AdminRecentUsers;
