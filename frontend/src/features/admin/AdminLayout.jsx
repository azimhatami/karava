import { Outlet } from 'react-router-dom';
import AdminPanelHeader from './AdminPanelHeader';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-white">
      <AdminPanelHeader />
      <div className="mx-auto flex max-w-[1440px] items-start gap-6 pl-6 pr-[108px] pb-8">
        <AdminSidebar />
        <main className="min-w-0 flex-1 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
