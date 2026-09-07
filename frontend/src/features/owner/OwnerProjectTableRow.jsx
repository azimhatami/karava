import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiOutlineTrash } from 'react-icons/hi';
import { TbPencilMinus } from 'react-icons/tb';
import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Modal from '../../ui/Modal';
import ProjectTags from '../../ui/ProjectTags';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateProjectForm from '../projects/CreateProjectForm';
import useRemoveProject from '../projects/useRemoveProject';

const projectStatus = {
  OPEN: {
    label: 'باز',
    className: 'bg-karava-green text-white',
  },
  CLOSED: {
    label: 'بسته',
    className: 'border border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]',
  },
};

function OwnerProjectTableRow({ project, isAlternate = false }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject, isDeleting } = useRemoveProject();
  const statusMeta = projectStatus[project.status] || projectStatus.CLOSED;

  return (
    <tr
      className={`owner-projects-table__row transition-colors hover:bg-[#EEF6F2] ${
        isAlternate ? 'bg-[#F7FBF9]' : 'bg-white'
      }`}
    >
      <td className="px-1 py-[19px] text-center text-sm text-[#111827]">
        {truncateText(project.title || '', 30)}
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {project.category?.title || '-'}
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {toPersianNumbersWithComma(project.budget || 0)} تومان
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {project.deadline ? shortDate(project.deadline) : '-'}
      </td>
      <td className="px-1 py-[19px]">
        <ProjectTags tags={project.tags} />
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {project.freelancer?.name || '-'}
      </td>
      <td className="px-1 py-[19px] text-center">
        <span
          className={`inline-flex min-w-[4.5rem] items-center justify-center rounded-[4px] px-2 py-0.5 text-center text-xs font-medium ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </td>
      <td className="px-1 py-[19px]">
        <div className="flex items-center justify-center gap-2">
          <Link
            to={`/owner/projects/${project._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-karava-blue-light/20 text-karava-blue transition-colors hover:bg-karava-blue-light/30"
            aria-label="مشاهده پروژه"
          >
            <HiEye className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FEF9C3] text-[#CA8A04] transition-colors hover:bg-[#FEF08A]"
            aria-label="ویرایش پروژه"
          >
            <TbPencilMinus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-karava-red/10 text-karava-red transition-colors hover:bg-karava-red/20"
            aria-label="حذف پروژه"
          >
            <HiOutlineTrash className="h-4 w-4" />
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
              disabled={isDeleting}
            />
          </Modal>
        </div>
      </td>
    </tr>
  );
}

export default OwnerProjectTableRow;
