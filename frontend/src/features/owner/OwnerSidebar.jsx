import {
  HiOutlineSquares2X2,
  HiOutlineRectangleStack,
  HiOutlineUserCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineWallet,
} from 'react-icons/hi2';
import useUser from '../authentication/useUser';
import useOwnerProjects from '../projects/useOwnerProjects';
import { useUnreadMessagesCount } from '../messages/useConversations';
import PanelSidebar from '../shared/PanelSidebar';

function OwnerSidebar() {
  const { user } = useUser();
  const { projects } = useOwnerProjects();
  const unreadMessages = useUnreadMessagesCount();

  const navItems = [
    {
      to: '/owner/dashboard',
      label: 'داشبورد',
      icon: HiOutlineSquares2X2,
      end: true,
    },
    {
      to: '/owner/projects',
      label: 'پروژه ها',
      icon: HiOutlineRectangleStack,
      badge: projects.length,
    },
    {
      to: '/owner/messages',
      label: 'گفتگوها',
      icon: HiOutlineChatBubbleLeftRight,
      badge: unreadMessages,
    },
    {
      to: '/owner/wallet',
      label: 'کیف پول',
      icon: HiOutlineWallet,
    },
    {
      to: '/owner/profile',
      label: 'پروفایل من',
      icon: HiOutlineUserCircle,
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
