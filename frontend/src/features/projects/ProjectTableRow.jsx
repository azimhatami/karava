import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Table from '../../ui/Table';
import { HiOutlineTrash, HiEye } from 'react-icons/hi';
import { TbPencilMinus } from 'react-icons/tb';
import Modal from '../../ui/Modal';
import { useState } from 'react';
import ConfirmDelete from '../../ui/ConfirmDelete';
import useRemoveProject from './useRemoveProject';
import CreateProjectForm from './CreateProjectForm';
import ToggleProjectStatus from './ToggleProjectStatus';
import ProjectTags from '../../ui/ProjectTags';
import { Link } from 'react-router';


function ProjectTableRow({ project, index }) {

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject, isDeleting } = useRemoveProject();

  return(
    <>
      <Table.Row>
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
          <ToggleProjectStatus project={project} />
          {/* {project.status === 'OPEN' ? (
            <span className='badge badge-success'>باز</span>
          ) : (
            <span className='badge badge-danger'>بسته</span>
          )} */}
        </td>
        <td>
          <div className='flex items-center gap-x-4'>
            <button onClick={() => setIsEditOpen(true)}>
              <TbPencilMinus className='w-5 h-5 text-primary-900 text-lg' />
            </button>
            <Modal 
              open={isEditOpen} 
              title={`ویرایش ${project.title}`} 
              onClose={() => setIsEditOpen(false)}
            >
              <CreateProjectForm 
                projectToEdit={project} 
                onClose={() => setIsEditOpen(false)}
              />
            </Modal>
            <button onClick={() => setIsDeleteOpen(true)}>
              <HiOutlineTrash className='w-5 h-5 text-error text-lg' />
            </button>
            <Modal 
              open={isDeleteOpen} 
              title={`حذف ${project.title}`} 
              onClose={() => setIsDeleteOpen(false)}
            >
              <ConfirmDelete 
                name={project.title} 
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => removeProject(project._id, {
                  onSuccess: () => setIsDeleteOpen(false),
                })}
                disabled={false}
              />
            </Modal>
          </div>
        </td>
        <td>
          <Link to={project._id} className='flex place-content-center'>
            <HiEye className='w-5 h-5 text-primary-900'/>
          </Link>
        </td>
      </Table.Row>
      
    </>
  );
}

export default ProjectTableRow
