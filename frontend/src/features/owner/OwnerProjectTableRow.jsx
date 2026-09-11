import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEye, HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import CreateProjectForm from '../projects/CreateProjectForm';
import useRemoveProject from '../projects/useRemoveProject';
import {
  DataCard,
  EscrowCell,
  GridRow,
  IconAction,
  Money,
  PrimaryCell,
} from '../../ui/DataTable';

export const OWNER_PROJECT_COLUMNS = [
  { key: 'project', label: 'پروژه', width: 'minmax(0, 2.6fr)' },
  { key: 'budget', label: 'بودجه', width: '1.1fr' },
  { key: 'escrow', label: 'وضعیت امانت', width: '1.2fr' },
  { key: 'actions', label: 'عملیات', width: '140px', align: 'end' },
];

const STATUS_KEY = {
  OPEN: 'open',
  CLOSED: 'closed',
  COMPLETED: 'completed',
};

function OwnerProjectTableRow({ project, variant = 'desktop' }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { removeProject, isDeleting } = useRemoveProject();

  const status = STATUS_KEY[project.status] || 'closed';
  const meta = [
    project.category?.title,
    project.deadline ? shortDate(project.deadline) : null,
    project.freelancer?.name || 'فریلنسر انتخاب نشده',
  ];

  const modals = (
    <>
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
    </>
  );

  const actions = (
    <>
      <IconAction
        as={Link}
        to={`/owner/projects/${project._id}`}
        icon={HiOutlineEye}
        label="مشاهده پروژه"
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
      {modals}
    </>
  );

  if (variant === 'card') {
    return (
      <DataCard
        title={project.title}
        status={status}
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
        actions={actions}
      />
    );
  }

  return (
    <GridRow columns={OWNER_PROJECT_COLUMNS}>
      <PrimaryCell title={project.title} status={status} meta={meta} />
      <Money amount={project.budget} />
      <EscrowCell status={project.escrowStatus} />
      <div className="flex items-center justify-end gap-2">{actions}</div>
    </GridRow>
  );
}

export default OwnerProjectTableRow;
