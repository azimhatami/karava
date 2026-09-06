import { Outlet } from 'react-router-dom';
import AdminPanelHeader from './AdminPanelHeader';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-karava-bg-subtle">
      <AdminPanelHeader />
      <div className="mx-auto flex max-w-[1440px] items-start gap-6 pl-6 pr-[108px] pb-8 pt-[25px]">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
