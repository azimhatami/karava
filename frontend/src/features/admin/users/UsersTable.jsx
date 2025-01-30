import useUsers from '../useUsers';
import Loading from '../../../ui/Loading';
import Empty from '../../../ui/Empty';
import Table from '../../../ui/Table';
import Pagination from '../../../ui/Pagination';
import UserRow from './UserRow';

import { useState } from 'react';


function UsersTable() {
  const { isLoading, users } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <Loading />;

  if (!users.length) return <Empty resourceName='کاربر' />;

  const itemsPerPage = 4

  // Calculate total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Get the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = users.slice(startIndex, endIndex);

  return(
    <>
      <Table>
        <Table.Header>
          <th>#</th>
          <th>نام</th>
          <th>ایمیل</th>
          <th>شماره موبایل</th>
          <th>نقش</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </Table.Header> 
        <Table.Body>
          {currentData.map((user, index) => (
            <UserRow key={user._id} user={user} index={index} />
          ))}
        </Table.Body>
      </Table>
      <Pagination 
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}


export default UsersTable
