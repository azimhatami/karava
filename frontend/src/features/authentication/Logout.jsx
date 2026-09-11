import { HiArrowRightOnRectangle } from "react-icons/hi2";
import useLogout from './useLogout';
import Loading from '../../ui/Loading';


function Logout() {

  const { isPending, logout } = useLogout();

  return(
    <>
      {isPending ? <Loading /> : (
        <div className='flex items-center'>
          <button onClick={logout}>
            <HiArrowRightOnRectangle 
              className='w-5 h-5 text-ink-muted hover:text-error' 
            />
          </button>
        </div>
      )}
    </>
  );
}


export default Logout
