import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import Loading from '../../ui/Loading';
import Modal from '../../ui/Modal';
import CreateProjectForm from '../projects/CreateProjectForm';
import useOwnerProjects from '../projects/useOwnerProjects';
import OwnerStats from './OwnerStats';
import OwnerDashboardProjectsTable from './OwnerDashboardProjectsTable';

function DashboardLayout() {
  const { isLoading, projects } = useOwnerProjects();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-[1103px] w-full flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[640px] text-right">
          <h2 className="owner-panel-title">داشبورد کارفرما</h2>
          <p className="owner-panel-subtitle mt-2">
            مدیریت پروژه ها , آمار درخواست ها و انتخاب فریلنسر متخصص
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-[6px] bg-karava-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-karava-blue"
        >
          <span>اضافه کردن پروژه</span>
          <HiPlus className="h-4 w-4" />
        </button>
      </div>

      <OwnerStats projects={projects} />
      <OwnerDashboardProjectsTable />

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

export default DashboardLayout;
