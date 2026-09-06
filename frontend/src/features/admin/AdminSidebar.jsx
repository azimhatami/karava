import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineRectangleStack,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
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
      icon: HiOutlineSquares2X2,
      end: true,
    },
    {
      to: '/admin/users',
      label: 'کاربران',
      icon: HiOutlineUsers,
      badge: users.length,
    },
    {
      to: '/admin/projects',
      label: 'پروژه ها',
      icon: HiOutlineRectangleStack,
      badge: projects.length,
    },
    {
      to: '/admin/proposals',
      label: 'درخواست های من',
      icon: HiOutlineDocumentText,
      badge: proposals.length,
    },
    {
      to: '/admin/profile',
      label: 'پروفایل من',
      icon: HiOutlineUserCircle,
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
