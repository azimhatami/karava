import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Table from '../../ui/Table';
import { MobileDataCard } from '../../ui/ResponsiveTable';
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

function ProjectTableRow({ project, index, variant = 'desktop' }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject } = useRemoveProject();

  const editDeleteActions = (
    <>
      <button type="button" onClick={() => setIsEditOpen(true)} aria-label="ویرایش">
        <TbPencilMinus className="h-5 w-5 text-lg text-primary-900" />
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

      <button type="button" onClick={() => setIsDeleteOpen(true)} aria-label="حذف">
        <HiOutlineTrash className="h-5 w-5 text-lg text-error" />
      </button>
      <Modal
        open={isDeleteOpen}
        title={`حذف ${project.title}`}
        onClose={() => setIsDeleteOpen(false)}
      >
        <ConfirmDelete
          name={project.title}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() =>
            removeProject(project._id, {
              onSuccess: () => setIsDeleteOpen(false),
            })
          }
          disabled={false}
        />
      </Modal>
    </>
  );

  const proposalsLink = (
    <Link to={project._id} className="flex place-content-center" aria-label="درخواست‌ها">
      <HiEye className="h-5 w-5 text-primary-900" />
    </Link>
  );

  if (variant === 'card') {
    return (
      <MobileDataCard
        title={project.title}
        fields={[
          { key: 'index', label: 'ردیف', value: index + 1 },
          {
            key: 'category',
            label: 'دسته بندی',
            value: project.category?.title || '—',
          },
          {
            key: 'budget',
            label: 'بودجه',
            value: toPersianNumbersWithComma(project.budget),
          },
          {
            key: 'deadline',
            label: 'ددلاین',
            value: shortDate(project.deadline),
          },
          {
            key: 'tags',
            label: 'تگ ها',
            value: <ProjectTags tags={project.tags} className="max-w-full" />,
          },
          {
            key: 'freelancer',
            label: 'فریلنسر',
            value: project.freelancer?.name || '—',
          },
          {
            key: 'status',
            label: 'وضعیت',
            value: <ToggleProjectStatus project={project} />,
          },
        ]}
        actions={
          <>
            {editDeleteActions}
            {proposalsLink}
          </>
        }
      />
    );
  }

  return (
    <Table.Row>
      <td>{index + 1}</td>
      <td>{truncateText(project.title, 30)}</td>
      <td>{project.category?.title}</td>
      <td>{toPersianNumbersWithComma(project.budget)}</td>
      <td>{shortDate(project.deadline)}</td>
      <td>
        <ProjectTags tags={project.tags} className="max-w-[200px]" />
      </td>
      <td>{project.freelancer?.name || '-'}</td>
      <td>
        <ToggleProjectStatus project={project} />
      </td>
      <td>
        <div className="flex items-center gap-x-4">{editDeleteActions}</div>
      </td>
      <td>{proposalsLink}</td>
    </Table.Row>
  );
}

export default ProjectTableRow;
