import { HiArrowRight } from 'react-icons/hi';
import { useState } from 'react';
import useMoveBack from '../../hooks/useMoveBack';
import Modal from '../../ui/Modal';
import useCompleteProject from './useCompleteProject';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';

function ProjectHeader({ project }) {
  const moveBack = useMoveBack();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { isCompleting, completeProject } = useCompleteProject();
  const canComplete =
    Boolean(project?.freelancer) &&
    project?.escrowStatus === 'held' &&
    project?.status !== 'COMPLETED';

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-x-4">
        <button type="button" onClick={moveBack}>
          <HiArrowRight className="h-5 w-5 text-secondary-600 hover:text-secondary-900" />
        </button>
        <h2 className="text-xl font-black text-secondary-700">
          لیست درخواست های {project.title}
        </h2>
      </div>

      {project?.status === 'COMPLETED' ? (
        <span className="inline-flex items-center rounded-[6px] bg-[#E0F2FE] px-3 py-1.5 text-xs font-bold text-[#075985]">
          پروژه تکمیل‌شده
        </span>
      ) : null}

      {canComplete ? (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[#006045] px-4 text-sm font-bold text-white hover:bg-[#004d37]"
        >
          تکمیل پروژه
        </button>
      ) : null}

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="تکمیل پروژه و واریز به فریلنسر"
      >
        <p className="text-sm leading-7 text-[#374151]">
          با تکمیل پروژه، مبلغ{' '}
          <span className="font-bold text-[#006045]">
            {toPersianNumbersWithComma(project.escrowAmount || 0)} تومان
          </span>{' '}
          از موجودی در انتظار شما آزاد و به کیف پول فریلنسر واریز می‌شود.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="btn btn-primary flex-1"
            disabled={isCompleting}
            onClick={() =>
              completeProject(project._id, {
                onSuccess: () => setConfirmOpen(false),
              })
            }
          >
            {isCompleting ? 'در حال تکمیل...' : 'تایید تکمیل'}
          </button>
          <button
            type="button"
            className="btn flex-1 border border-[#D1D5DB] bg-white text-[#222020]"
            onClick={() => setConfirmOpen(false)}
            disabled={isCompleting}
          >
            انصراف
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProjectHeader;
