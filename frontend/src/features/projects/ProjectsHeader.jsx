import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import Modal from '../../ui/Modal';
import CreateProjectForm from './CreateProjectForm';

function ProjectsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="shrink-0 text-xl font-black text-secondary-700">
        پروژه‌های شما
      </h1>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-[46px] w-auto items-center gap-2 rounded-[6px] bg-ink-mint-mid px-4 text-sm font-bold text-white transition-colors hover:bg-ink-mint-deep"
      >
        <span>اضافه کردن پروژه</span>
        <HiOutlinePlus className="h-4 w-4" />
      </button>

      <Modal
        title="اضافه کردن پروژه جدید"
        open={open}
        onClose={() => setOpen(false)}
      >
        <CreateProjectForm onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
}

export default ProjectsHeader;
