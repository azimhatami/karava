import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Table from '../../ui/Table';


function ProjectTableRow({ project, index }) {
  return(
    <>
      <Table.Row key={project._id}>
        <td>{index + 1}</td>
        <td>{truncateText(project.title, 30)}</td>
        <td>{project.category.title}</td>
        <td>{toPersianNumbersWithComma(project.budget)}</td>
        <td>{shortDate(project.deadline)}</td>
        <td>
          <div className='flex flex-wrap items-center gap-2 max-w-[200px]'>
            {project.tags.map(tag => <span className='badge badge-secondary' key={tag}>{tag}</span>)}
          </div>
        </td>
        <td>{project.freelancer?.name || '-'}</td>
        <td>
          {project.status === 'OPEN' ? (
            <span className='badge badge-success'>باز</span>
          ) : (
            <span className='badge badge-danger'>بسته</span>
          )}
        </td>
        <td>...</td>
      </Table.Row>
      
    </>
  );
}

export default ProjectTableRow
