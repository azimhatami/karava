import truncateText from '../../../utils/truncateText';
import shortDate from '../../../utils/shortDate';
import Table from '../../../ui/Table';

import { toPersianNumbersWithComma } from '../../../utils/toPersianNumbers';
import { MdAssignmentAdd } from "react-icons/md";

const projectStatus = {
  OPEN: {
    label: 'باز',
    className: 'badge-success'
  },
  CLOSE: {
    label: 'بسته',
    className: 'badge-danger'
  }
};

function ProjectTableRow({ project, index }) {

  const { status } = project;

  return(
    <>
      <Table.Row>
        <td>{index + 1}</td>
        <td>{truncateText(project.title, 30)}</td>
        <td>{toPersianNumbersWithComma(project.budget)}</td>
        <td>{shortDate(project.deadline)}</td>
        <td>
          <span className={`badge ${projectStatus[status].className}`}>{projectStatus[status].label}</span>
        </td>
        <td>
          <button>
            <MdAssignmentAdd className='w-5 h-5 text-primary-900'/>
          </button>
        </td>
      </Table.Row>
      
    </>
  );
}

export default ProjectTableRow
