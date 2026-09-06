import {
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import useProjects from '../../hooks/useProjects';
import useProposals from '../proposals/useProposals';
import PanelSidebar from '../shared/PanelSidebar';

function FreelancerSidebar() {
  const { user } = useUser();
  const { projects } = useProjects();
  const { proposals } = useProposals();

  const openProjectsCount = projects.filter((p) => p.status === 'OPEN').length;

  const navItems = [
    {
      to: '/freelancer/dashboard',
      label: 'داشبورد',
      icon: HiOutlineSquares2X2,
      end: true,
    },
    {
      to: '/freelancer/projects',
      label: 'فرصت های شغلی',
      icon: HiOutlineBriefcase,
      badge: openProjectsCount,
    },
    {
      to: '/freelancer/proposals',
      label: 'درخواست های من',
      icon: HiOutlineDocumentText,
      badge: proposals.length,
    },
    {
      to: '/freelancer/profile',
      label: 'پروفایل من',
      icon: HiOutlineUserCircle,
    },
  ];

  return (
    <PanelSidebar
      roleLabel={{ name: user?.name || 'کاربر', title: 'کارجو' }}
      navItems={navItems}
    />
  );
}

export default FreelancerSidebar;
