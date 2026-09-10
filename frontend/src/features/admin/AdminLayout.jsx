import { Outlet } from 'react-router-dom';
import AdminPanelHeader from './AdminPanelHeader';
import useAdminPanelNav from './useAdminPanelNav';
import PanelSidebar from '../shared/PanelSidebar';
import PanelMobileDrawer from '../shared/PanelMobileDrawer';
import { PanelNavProvider } from '../shared/PanelNavContext';

function AdminLayout() {
  const { roleLabel, navItems } = useAdminPanelNav();

  return (
    <PanelNavProvider roleLabel={roleLabel} navItems={navItems}>
      <div className="min-h-screen bg-karava-bg-subtle">
        <AdminPanelHeader />
        <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-4 px-4 pb-8 pt-4 md:gap-6 md:px-6 md:pt-[25px] lg:flex-row lg:items-start xl:pl-6 xl:pr-[108px]">
          <PanelSidebar />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
        <PanelMobileDrawer />
      </div>
    </PanelNavProvider>
  );
}

export default AdminLayout;
