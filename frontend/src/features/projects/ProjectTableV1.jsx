import useOwnerProjects from './useOwnerProjects';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import ProjectTags from '../../ui/ProjectTags';


function ProjectTable() {
  const { isLoading, projects } = useOwnerProjects();

  if (isLoading) return <Loading />;

  if (!projects?.length) return <Empty />;

  return(
    <div>
      <table>
        <thead>
          <tr className='title-row'>
            <th>#</th>
            <th>عنوان پروژه</th>
            <th>دسته بندی</th>
            <th>بودجه</th>
            <th>ددلاین</th>
            <th>تگ ها</th>
            <th>فریلنسر</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project._id}>
              <td>{index + 1}</td>
              <td>{truncateText(project.title, 30)}</td>
              <td>{project.category.title}</td>
              <td>{toPersianNumbersWithComma(project.budget)}</td>
              <td>{shortDate(project.deadline)}</td>
              <td>
                <ProjectTags tags={project.tags} className="max-w-[200px]" />
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default ProjectTable
