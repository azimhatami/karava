import { Outlet } from 'react-router-dom';
import OwnerPanelHeader from './OwnerPanelHeader';
import OwnerSidebar from './OwnerSidebar';

function OwnerLayout() {
  return (
    <div className="min-h-[1225px] bg-white">
      <OwnerPanelHeader />
      <div className="mx-auto flex max-w-[1440px] items-start gap-6 pl-6 pr-[108px] pb-8">
        <OwnerSidebar />
        <main className="min-w-0 flex-1 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;
