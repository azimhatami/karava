import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useDarkMode } from '../context/DarkModeContext';
import { useEffect } from 'react';


function DarkModeToggle() {

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return(
    <div className='flex items-center'>
      <button onClick={toggleDarkMode}>
        {
          isDarkMode ? (
            <HiOutlineSun className='w-5 h-5 text-ink-mint-mid'/>
          ) : (
            <HiOutlineMoon className='w-5 h-5 text-ink-mint-mid'/>
          )
        }
      </button>
    </div>
  );
}


export default DarkModeToggle
