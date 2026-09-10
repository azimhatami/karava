import {
  HiOutlineSquares2X2,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineWallet,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import useProjects from '../../hooks/useProjects';
import useProposals from '../proposals/useProposals';
import { useUnreadMessagesCount } from '../messages/useConversations';

export default function useFreelancerPanelNav() {
  const { user } = useUser();
  const { projects } = useProjects();
  const { proposals } = useProposals();
  const unreadMessages = useUnreadMessagesCount();
  const openProjectsCount = projects.filter((p) => p.status === 'OPEN').length;

  const roleLabel = {
    name: user?.name || 'کاربر',
    title: 'کارجو',
  };

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
      to: '/freelancer/messages',
      label: 'گفتگوها',
      icon: HiOutlineChatBubbleLeftRight,
      badge: unreadMessages,
    },
    {
      to: '/freelancer/wallet',
      label: 'کیف پول',
      icon: HiOutlineWallet,
    },
    {
      to: '/freelancer/profile',
      label: 'پروفایل من',
      icon: HiOutlineUserCircle,
    },
  ];

  return { roleLabel, navItems };
}
