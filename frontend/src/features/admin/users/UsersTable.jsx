import { useState } from 'react';
import useUsers from '../useUsers';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import QueryErrorState from '../../../ui/QueryErrorState';
import Pagination from '../../../ui/Pagination';
import UserRow, { USER_COLUMNS } from './UserRow';
import ResponsiveTable from '../../../ui/ResponsiveTable';
import { HiOutlineUsers } from 'react-icons/hi2';

function UsersTable() {
  const { isLoading, isError, error, refetch, users } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!users.length) {
    return (
      <Empty
        resourceName="کاربری"
        title="هنوز کاربری ثبت نشده است"
        description="با ثبت‌نام کاربران جدید، لیست اینجا نمایش داده می‌شود."
        icon={HiOutlineUsers}
      />
    );
  }

  const itemsPerPage = 4;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = users.slice(startIndex, endIndex);

  return (
    <section className="flex w-full flex-col gap-4">
      <ResponsiveTable
        columns={USER_COLUMNS}
        data={currentData}
        desktop={
          <div className="w-full overflow-x-auto rounded-2xl border border-ink-line bg-ink-card">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="border-b border-ink-hair bg-[#FBFAF6]">
                  {USER_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-4 py-3 text-right text-[12.5px] font-normal text-ink-dim"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((user) => (
                  <UserRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        }
        renderCard={(user) => <UserRow user={user} variant="card" />}
      />

      <Pagination
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </section>
  );
}

export default UsersTable;
