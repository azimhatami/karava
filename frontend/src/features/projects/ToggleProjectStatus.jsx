import { Switch } from '@headlessui/react';
import { useState } from 'react';
import useToggleProjectStatus from './useToggleProjectStatus';
import Loading from '../../ui/Loading';
import Toggle from '../../ui/Toggle';


function ToggleProjectStatus({ project }) {

  const { isToggling, toggleProjectStatus } = useToggleProjectStatus();

  const toggleHandler = () => {
    const status = project.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    toggleProjectStatus(
      { 
        id: project._id, 
        data: { status },
      },
    )
  };

  return(
    <div>
      {project.status === 'COMPLETED' ? (
        <span className="badge bg-[#E0F2FE] text-[#075985]">تکمیل‌شده</span>
      ) : isToggling ? <div className='w-[3rem]'><Loading /></div> : (
        <Toggle 
          label={project.status === 'OPEN' ? 'باز' : 'بسته'}
          enabled={project.status === 'OPEN' ? true : false}
          onChange={toggleHandler}
        />
      )}
    </div>
  );
}


export default ToggleProjectStatus
