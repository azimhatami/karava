import Stat from '../../ui/Stat';
import {
  HiOutlineViewGrid, 
  HiUsers,
  HiCollection 
} from "react-icons/hi";


function Stats({ proposals, users, projects }) {
  return(
    <div className='grid grid-rows-3 grid-cols-1 gap-y-4 md:grid md:grid-cols-3 md:gap-x-8'>
      <Stat 
        icon={<HiUsers className='w-20 h-20' />} 
        title='کاربران' 
        value={users}
        color='green'
      />
      <Stat 
        icon={<HiOutlineViewGrid className='w-20 h-20' />} 
        title='درخواست ها' 
        value={proposals}
        color='primary'
      />
      <Stat 
        icon={<HiCollection className='w-20 h-20' />} 
        title='پروژه ها' 
        value={projects}
        color='red'
      />
    </div>
  );
}

export default Stats
