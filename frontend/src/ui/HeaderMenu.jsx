import { Link } from 'react-router';
import { HiOutlineHome } from "react-icons/hi";
import DarkModeToggle from './DarkModeToggle';
import Logout from '../features/authentication/Logout';


function HeaderMenu() {
  return(
    <>
      <ul className='flex gap-x-4 items-center'>
        <li>
          <Link to='/'>
            <HiOutlineHome className='w-5 h-5 text-primary-900'/>
          </Link>
        </li>
        <li>
          <DarkModeToggle />
        </li>
        <li>
          <Logout />
        </li>
      </ul>
    </>
  );
}


export default HeaderMenu
