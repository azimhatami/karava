import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import Loading from '../../ui/Loading';
import Modal from '../../ui/Modal';
import CreateProjectForm from '../projects/CreateProjectForm';
import useOwnerProjects from '../projects/useOwnerProjects';
import useUser from '../authentication/useUser';
import OwnerStats from './OwnerStats';
import OwnerDashboardProjectsTable from './OwnerDashboardProjectsTable';
import ProfileCompletionCard from '../profile/ProfileCompletionCard';

function DashboardLayout() {
  const { user } = useUser();
  const { isLoading, projects } = useOwnerProjects();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-[1103px] w-full flex-col gap-6">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="min-w-0 flex-1 text-right">
          <h2 className="owner-panel-title">داشبورد کارفرما</h2>
          <p className="owner-panel-subtitle mt-2">
            مدیریت پروژه ها , آمار درخواست ها و انتخاب فریلنسر متخصص
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-[6px] bg-[#006045] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#004d37]"
        >
          <span>اضافه کردن پروژه</span>
          <HiPlus className="h-4 w-4" />
        </button>
      </div>

      <ProfileCompletionCard user={user} profilePath="/owner/profile" />

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
