import { useState } from 'react';
import useUsers from '../useUsers';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import Pagination from '../../../ui/Pagination';
import UserRow from './UserRow';

const USERS_GRID_COLS =
  'grid-cols-[1.1fr_1.6fr_1.1fr_0.9fr_1fr_0.8fr]';

const columns = [
  { key: 'name', label: 'نام' },
  { key: 'email', label: 'ایمیل' },
  { key: 'phone', label: 'شماره موبایل' },
  { key: 'role', label: 'نقش' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' },
];

function UsersTable() {
  const { isLoading, users } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;
  if (!users.length) return <Empty resourceName="کاربر" />;

  const itemsPerPage = 4;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = users.slice(startIndex, endIndex);

  return (
    <section className="flex w-full rotate-0 flex-col gap-[7px] opacity-100">
      <div className="flex h-[494px] w-full rotate-0 flex-col overflow-hidden rounded-[6px] border border-[#245A49] bg-white p-3 opacity-100">
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto">
          <div
            className={`grid h-[19px] w-full shrink-0 rotate-0 items-center ${USERS_GRID_COLS} opacity-100`}
          >
            {columns.map((column) => (
              <span
                key={column.key}
                className="h-[19px] rotate-0 whitespace-nowrap text-center font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100"
              >
                {column.label}
              </span>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            {currentData.map((user) => (
              <UserRow key={user._id} user={user} />
            ))}
          </div>
        </div>
      </div>

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
