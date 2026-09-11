import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import {
  DataCard,
  EscrowCell,
  GridRow,
  IconAction,
  Money,
  PrimaryCell,
} from '../../ui/DataTable';
import {
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import Modal from '../../ui/Modal';
import { useState } from 'react';
import ConfirmDelete from '../../ui/ConfirmDelete';
import useRemoveProject from './useRemoveProject';
import CreateProjectForm from './CreateProjectForm';
import ToggleProjectStatus from './ToggleProjectStatus';
import { Link } from 'react-router-dom';

export const OWNER_PROJECTS_COLUMNS = [
  { key: 'project', label: 'پروژه', width: 'minmax(0, 2.4fr)' },
  { key: 'budget', label: 'بودجه', width: '1fr' },
  { key: 'escrow', label: 'وضعیت امانت', width: '1.1fr' },
  { key: 'status', label: 'باز/بسته', width: '0.9fr' },
  { key: 'actions', label: 'عملیات', width: '140px', align: 'end' },
];

const STATUS_KEY = { OPEN: 'open', CLOSED: 'closed', COMPLETED: 'completed' };

function ProjectTableRow({ project, variant = 'desktop' }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject } = useRemoveProject();

  const meta = [
    project.category?.title,
    project.deadline ? shortDate(project.deadline) : null,
    project.freelancer?.name || 'فریلنسر انتخاب نشده',
  ];

  const actions = (
    <>
      <IconAction
        as={Link}
        to={project._id}
        icon={HiOutlineChatBubbleLeftRight}
        label="پیشنهادهای این پروژه"
      />
      <IconAction
        icon={HiOutlinePencilSquare}
        label="ویرایش پروژه"
        onClick={() => setIsEditOpen(true)}
      />
      <IconAction
        icon={HiOutlineTrash}
        label="حذف پروژه"
        tone="danger"
        onClick={() => setIsDeleteOpen(true)}
      />

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
          disabled={false}
        />
      </Modal>
    </>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={project.title}
        status={STATUS_KEY[project.status] || 'closed'}
        meta={meta.filter(Boolean)}
        stats={[
          {
            label: 'بودجه (تومان)',
            value: toPersianNumbersWithComma(project.budget || 0),
          },
          {
            label: 'وضعیت امانت',
            value: <EscrowCell status={project.escrowStatus} />,
          },
        ]}
        actions={
          <>
            {project.status === 'COMPLETED' ? null : (
              <ToggleProjectStatus project={project} />
            )}
            <span className="flex flex-1 items-center justify-end gap-2">
              {actions}
            </span>
          </>
        }
      />
    );
  }

  return (
    <GridRow columns={OWNER_PROJECTS_COLUMNS}>
      <PrimaryCell
        title={project.title}
        status={STATUS_KEY[project.status] || 'closed'}
        meta={meta}
      />
      <Money amount={project.budget} />
      <EscrowCell status={project.escrowStatus} />
      {project.status === 'COMPLETED' ? (
        <span className="text-[13px] text-ink-dim">—</span>
      ) : (
        <ToggleProjectStatus project={project} />
      )}
      <div className="flex items-center justify-end gap-2">{actions}</div>
    </GridRow>
  );
}

export default ProjectTableRow;
