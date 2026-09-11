import {
  HiOutlineUsers,
  HiOutlineDocumentText,
  HiOutlineFolderOpen,
} from 'react-icons/hi2';
import StatCard, { StatGrid } from '../../ui/StatCard';

function AdminStats({ users = 0, proposals = 0, projects = 0 }) {
  return (
    <StatGrid>
      <StatCard icon={HiOutlineUsers} title="کاربران" value={users} />
      <StatCard
        icon={HiOutlineDocumentText}
        title="درخواست ها"
        value={proposals}
      />
      <StatCard icon={HiOutlineFolderOpen} title="پروژه" value={projects} />
    </StatGrid>
  );
}

export default AdminStats;
