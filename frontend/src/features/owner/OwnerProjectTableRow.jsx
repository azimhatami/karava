import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiEye, HiOutlineTrash } from 'react-icons/hi';
import { TbPencilMinus } from 'react-icons/tb';
import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateProjectForm from '../projects/CreateProjectForm';
import useRemoveProject from '../projects/useRemoveProject';

function OwnerProjectTableRow({ project, isAlternate = false }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject, isDeleting } = useRemoveProject();
  const isOpen = project.status === 'OPEN';

  return (
    <tr
      className={`owner-projects-table__row transition-colors hover:bg-[#EEF6F2] ${
        isAlternate ? 'bg-[#F7FBF9]' : 'bg-white'
      }`}
    >
      <td className="px-1 py-[19px] text-center text-sm text-[#111827]">
        {truncateText(project.title, 30)}
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {project.category?.title || '-'}
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {toPersianNumbersWithComma(project.budget)}
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {shortDate(project.deadline)}
      </td>
      <td className="px-1 py-[19px]">
        <div className="flex flex-wrap justify-center gap-1">
          {(project.tags || []).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-karava-green px-2 py-0.5 text-xs text-white"
            >
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-white" />
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="px-1 py-[19px] text-center text-sm text-[#374151]">
        {project.freelancer?.name || '-'}
      </td>
      <td className="px-1 py-[19px] text-center">
        <span
          className={`inline-flex rounded-[4px] px-2 py-0.5 text-xs font-medium ${
            isOpen
              ? 'bg-karava-green text-white'
              : 'border border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]'
          }`}
        >
          {isOpen ? 'باز' : 'بسته'}
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
        </div>

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
      </td>
    </tr>
  );
}

export default OwnerProjectTableRow;
