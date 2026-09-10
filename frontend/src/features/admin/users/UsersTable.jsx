import { useState } from 'react';
import useUsers from '../useUsers';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import QueryErrorState from '../../../ui/QueryErrorState';
import Pagination from '../../../ui/Pagination';
import UserRow, { USERS_GRID_COLS } from './UserRow';
import ResponsiveTable from '../../../ui/ResponsiveTable';
import { HiOutlineUsers } from 'react-icons/hi2';

const columns = [
  { key: 'name', label: 'نام' },
  { key: 'email', label: 'ایمیل' },
  { key: 'phone', label: 'شماره موبایل' },
  { key: 'role', label: 'نقش' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
];

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
    <section className="flex w-full flex-col gap-[7px]">
      <ResponsiveTable
        columns={columns}
        data={currentData}
        desktop={
          <div className="flex h-[494px] w-full flex-col overflow-hidden rounded-[6px] border border-[#245A49] bg-white p-3">
            <div className="min-h-0 w-full flex-1 overflow-x-auto">
              <div className="flex min-h-0 min-w-[720px] flex-1 flex-col">
                <div
                  className={`grid h-[19px] w-full shrink-0 items-center ${USERS_GRID_COLS}`}
                >
                  {columns.map((column) => (
                    <span
                      key={column.key}
                      className="h-[19px] whitespace-nowrap text-center text-base font-bold leading-none text-[#222020]"
                    >
                      {column.label}
                    </span>
                  ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {currentData.map((user) => (
                    <UserRow key={user._id} user={user} />
                  ))}
                </div>
              </div>
            </div>
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
