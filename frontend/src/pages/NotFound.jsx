import { HiArrowRight } from "react-icons/hi";
import useMoveBack from '../hooks/useMoveBack';


function NotFound() {

  const moveBack = useMoveBack();

  return(
    <>
      <div className='sm:max-w-md flex justify-center'>
        <div className='flex flex-col gap-y-10 mt-10'>
          <button className='flex items-center gap-x-2' onClick={moveBack}>
            <HiArrowRight className='w-6 h-6 text-primary-900'/>
            <span className='font-semibold text-secondary-700 hover:text-secondary-900'>بازگشت</span>
          </button>
          <p className='text-secondary-800 font-bold text-xl'>صفحه ای که دنبالش بودید پیدا نشد</p>
        </div>
      </div>
    </>
  );
}


export default NotFound;
