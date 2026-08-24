import { Outlet } from 'react-router-dom';
import FreelancerPanelHeader from './FreelancerPanelHeader';
import FreelancerSidebar from './FreelancerSidebar';

function FreelancerLayout() {
  return (
    <div className="min-h-screen bg-karava-bg-subtle">
      <FreelancerPanelHeader />
      <div className="mx-auto flex max-w-[1440px] items-start gap-6 pl-6 pr-[108px] pb-8">
        <FreelancerSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FreelancerLayout;
