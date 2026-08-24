import {
  HiSquares2X2,
  HiBriefcase,
  HiDocumentText,
  HiUserCircle,
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
      icon: HiSquares2X2,
      end: true,
    },
    {
      to: '/freelancer/projects',
      label: 'فرصت های شغلی',
      icon: HiBriefcase,
      badge: openProjectsCount,
    },
    {
      to: '/freelancer/proposals',
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
      roleLabel={{ name: user?.name || 'کاربر', title: 'کارجو' }}
      navItems={navItems}
    />
  );
}

export default FreelancerSidebar;
