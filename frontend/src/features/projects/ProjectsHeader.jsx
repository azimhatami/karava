import { useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi';
import Modal from '../../ui/Modal';
import CreateProjectForm from './CreateProjectForm';

function ProjectsHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h1 className="shrink-0 text-xl font-black text-secondary-700">
        پروژه‌های شما
      </h1>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[6px] bg-karava-green px-4 text-sm font-bold text-white transition-colors hover:bg-karava-green-dark"
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
