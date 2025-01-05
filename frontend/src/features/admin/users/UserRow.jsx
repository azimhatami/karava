import { useState } from 'react';

import Table from '../../../ui/Table';
import Modal from '../../../ui/Modal';
import ChangeUserStatus from './ChangeUserStatus';


function UserRow({ user, index }) {

  const userStatus = [
    {
      label: 'رد شده',
      className: 'badge-danger',
    },
    {
      label: 'در انتظار تایید',
      className: 'badge-secondary',
    },
    {
      label: 'تایید شده',
      className: 'badge-success',
    }
  ];

  const { status } = user;
  const [open, setOpen] = useState(false);

  return(
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.phoneNumber}</td>
        <td>{user.role}</td>
        <td>
          <span className={`badge ${userStatus[status].className}`}>{userStatus[status].label}</span>
        </td>
        <td>
          <Modal 
            title='تغییر وضعیت درخواست' 
            open={open} 
            onClose={() => setOpen(false)}
          >
            <ChangeUserStatus userId={user._id} onClose={() => setOpen(false)} />
          </Modal>
          <button onClick={() => setOpen(true)}>تعییر وضعیت</button>
        </td>
      </Table.Row>
      
    </>
  );
}

export default UserRow
