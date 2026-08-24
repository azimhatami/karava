import {
  HiSquares2X2,
  HiRectangleStack,
  HiUserCircle,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import useOwnerProjects from '../projects/useOwnerProjects';
import PanelSidebar from '../shared/PanelSidebar';

function OwnerSidebar() {
  const { user } = useUser();
  const { projects } = useOwnerProjects();

  const navItems = [
    {
      to: '/owner/dashboard',
      label: 'داشبورد',
      icon: HiSquares2X2,
      end: true,
    },
    {
      to: '/owner/projects',
      label: 'پروژه ها',
      icon: HiRectangleStack,
      badge: projects.length,
    },
    {
      to: '/complete-profile',
      label: 'پروفایل من',
      icon: HiUserCircle,
    },
  ];

  return (
    <PanelSidebar
      roleLabel={{ name: user?.name || 'کاربر', title: 'کارفرما' }}
      navItems={navItems}
    />
  );
}

export default OwnerSidebar;
