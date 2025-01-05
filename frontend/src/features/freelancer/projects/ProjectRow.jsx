import truncateText from '../../../utils/truncateText';
import shortDate from '../../../utils/shortDate';
import Table from '../../../ui/Table';
import Modal from '../../../ui/Modal';
import CreateProposal from '../../proposals/CreateProposal';

import { toPersianNumbersWithComma } from '../../../utils/toPersianNumbers';
import { MdAssignmentAdd } from "react-icons/md";
import { useState } from 'react';

const projectStatus = {
  OPEN: {
    label: 'باز',
    className: 'badge-success'
  },
  CLOSED: {
    label: 'بسته',
    className: 'badge-danger'
  }
};

function ProjectTableRow({ project, index }) {

  const { status, title, budget, deadline } = project;
  const [open, setIsOpen] = useState(false);

  return(
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{truncateText(title, 30)}</td>
        <td>{toPersianNumbersWithComma(budget)}</td>
        <td>{shortDate(deadline)}</td>
        <td>
          <span className={`badge ${projectStatus[status].className}`}>{projectStatus[status].label}</span>
        </td>
        <td>
          <Modal 
            open={open}
            onClose={() => setIsOpen(false)}
            title={`درخواست انجام پروژه ${title}`}
          >
            <CreateProposal onClose={() => setIsOpen(false)} projectId={project._id} />
          </Modal> 
          <button onClick={() => setIsOpen(true)}>
            <MdAssignmentAdd className='w-5 h-5 text-primary-900'/>
          </button>
        </td>
      </Table.Row>
      
    </>
  );
}

export default ProjectTableRow
