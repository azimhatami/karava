import { Outlet } from 'react-router-dom';
import OwnerPanelHeader from './OwnerPanelHeader';
import useOwnerPanelNav from './useOwnerPanelNav';
import PanelSidebar from '../shared/PanelSidebar';
import PanelMobileDrawer from '../shared/PanelMobileDrawer';
import { PanelNavProvider } from '../shared/PanelNavContext';

function OwnerLayout() {
  const { roleLabel, navItems } = useOwnerPanelNav();

  return (
    <PanelNavProvider roleLabel={roleLabel} navItems={navItems}>
      <div className="min-h-screen bg-ink-paper">
        <OwnerPanelHeader />
        <div className="mx-auto flex max-w-[1440px] flex-col items-stretch gap-5 px-4 pb-10 pt-5 md:gap-6 md:px-8 md:pt-6 lg:flex-row lg:items-start xl:px-10">
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

export default OwnerLayout;
