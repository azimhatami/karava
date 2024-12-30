import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useDarkMode } from '../context/DarkModeContext';
import { useEffect } from 'react';


function DarkModeToggle() {

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');

    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode])

  return(
    <div className='flex items-center'>
      <button onClick={toggleDarkMode}>
        {
          isDarkMode ? (
            <HiOutlineSun className='w-5 h-5 text-primary-900'/>
          ) : (
            <HiOutlineMoon className='w-5 h-5 text-primary-900'/>
          )
        }
      </button>
    </div>
  );
}


export default DarkModeToggle
