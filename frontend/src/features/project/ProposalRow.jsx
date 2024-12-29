import Table from '../../ui/Table';
import truncateText from '../../utils/truncateText';
import Modal from '../../ui/Modal';
import ChangeProposalStatus from './ChangeProposalStatus';

import { useState } from 'react';


function ProposalRow({ proposal, index }) {

  const { status, user } = proposal;

  const statusStyle = [
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

  const [open, setOpen] = useState(false);

  return(
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>
          <p>
            {truncateText(proposal.description, 30)}
          </p>
        </td>
        <td>{proposal.duration}</td>
        <td>{proposal.price}</td>
        <td>
          <span className={`badge ${statusStyle[status].className}`}>
            {statusStyle[status].label}
          </span>
        </td>
        <td>
          <Modal 
            title='تغییر وضعیت درخواست' 
            open={open} 
            onClose={() => setOpen(false)}
          >
            <ChangeProposalStatus proposalId={proposal._id} onClose={() => setOpen(false)} />
          </Modal>
          <button onClick={() => setOpen(true)}>تعییر وضعیت</button>
        </td>
      </Table.Row>
    </>
  );
}



export default ProposalRow
