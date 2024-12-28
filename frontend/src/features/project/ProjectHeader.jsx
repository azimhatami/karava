import { HiArrowRight } from 'react-icons/hi';
import useMoveBack from '../../hooks/useMoveBack';


function ProjectHeader({ project }) {
  const moveBack = useMoveBack();
  return(
    <div className='flex gap-x-4 mb-8'>
      <button onClick={moveBack}>
        <HiArrowRight className='w-5 h-5 text-secondary-600 hover:text-secondary-900' />
      </button>
      <h2 className='font-black text-secondary-700 text-xl'>لیست درخواست های {project.title}</h2>
    </div>
  );
}


export default ProjectHeader
