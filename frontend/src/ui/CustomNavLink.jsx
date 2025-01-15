import { NavLink } from 'react-router-dom';


function CustomNavLink({ children, to}) {

  const navLinkClass = `flex items-center gap-x-2 hover:bg-primary-100/50 dark:hover:bg-secondary-200/60 
    \ hover:text-primary-900 dark:hover:text-primary-700 px-2 py-1.5 rounded-lg transition-all duration-300 text-[1.5rem] md:text-base`;

  return(
    <>
      <li className='md:w-full'>
        <NavLink to={to} className={({ isActive }) => isActive ? (
          `${navLinkClass} bg-primary-100/50  text-primary-900 dark:text-primary-700 dark:bg-secondary-200/60`
        ) : (
          `${navLinkClass} text-secondary-600 dark:text-secondary-500`
        )}
        >
          { children }
        </NavLink>
      </li>
    </>
  );
}


export default CustomNavLink
