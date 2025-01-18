import useUser from '../features/authentication/useUser';
import HeaderMenu from './HeaderMenu';
import UserAvatar from '../features/authentication/UserAvatar';


function Header() {
  const { user, isLoading } = useUser();
  return(
    <>
      <div className='bg-secondary-0 py-4 md:px-8 border-b border-secondary-200'>
        <div 
          className={`container xl:max-w-screen-xl flex items-center justify-between 
            \ gap-x-8 ${isLoading ? 'blur-sm opacity-50' : ''}`}
        >
          <UserAvatar />
          <HeaderMenu />
        </div>
      </div>
    </>
  );
}


export default Header
