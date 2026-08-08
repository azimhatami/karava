import Stat from '../../ui/Stat';
import {
  HiOutlineViewGrid, 
  HiCurrencyDollar, 
  HiCollection 
} from "react-icons/hi";


function Stats({ projects = [] }) {

  const numOfProjects = projects.length;
  const numOfAcceptedProjects = projects.filter((p) => p.status === 2).length;
  const numOfProposal = projects.reduce(
    (accumulator, currentValue) => (currentValue.proposals?.length || 0) + accumulator,
    0
  );

  return(
    <div className='grid grid-cols-3 gap-x-8'>
      <Stat 
        icon={<HiOutlineViewGrid className='w-20 h-20' />} 
        title='پروژه ها' 
        value={numOfProjects}
        color='primary'
      />
      <Stat 
        icon={<HiCurrencyDollar className='w-20 h-20' />} 
        title='پروژه های واگذار شده' 
        value={numOfAcceptedProjects}
        color='green'
      />
      <Stat 
        icon={<HiCollection className='w-20 h-20' />} 
        title='درخواست ها' 
        value={numOfProposal}
        color='red'
      />
    </div>
  );
}


export default Stats
