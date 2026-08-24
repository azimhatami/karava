import {
  HiSquares2X2,
  HiUsers,
  HiRectangleStack,
  HiDocumentText,
  HiUserCircle,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import useUsers from './useUsers';
import useProjects from '../../hooks/useProjects';
import useProposals from '../proposals/useProposals';
import PanelSidebar from '../shared/PanelSidebar';

function AdminSidebar() {
  const { user } = useUser();
  const { users } = useUsers();
  const { projects } = useProjects();
  const { proposals } = useProposals();

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'داشبورد',
      icon: HiSquares2X2,
      end: true,
    },
    {
      to: '/admin/users',
      label: 'کاربران',
      icon: HiUsers,
      badge: users.length,
    },
    {
      to: '/admin/projects',
      label: 'پروژه ها',
      icon: HiRectangleStack,
      badge: projects.length,
    },
    {
      to: '/admin/proposals',
      label: 'درخواست های من',
      icon: HiDocumentText,
      badge: proposals.length,
    },
    {
      to: '/complete-profile',
      label: 'پروفایل من',
      icon: HiUserCircle,
    },
  ];

  return (
    <PanelSidebar
      roleLabel={{ name: user?.name || 'کاربر', title: 'ادمین' }}
      navItems={navItems}
    />
  );
}

export default AdminSidebar;
