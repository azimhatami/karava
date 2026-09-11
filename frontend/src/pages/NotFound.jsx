import { HiArrowRight } from "react-icons/hi";
import useMoveBack from '../hooks/useMoveBack';


function NotFound() {

  const moveBack = useMoveBack();

  return(
    <div className='h-screen bg-ink-card'>
      <div className='container xl:max-w-screen-xl'>
        <div className='sm:max-w-md flex justify-center'>
          <div className='flex flex-col gap-y-10 mt-10'>
            <button className='flex items-center gap-x-2' onClick={moveBack}>
              <HiArrowRight className='w-6 h-6 text-ink-mint-mid'/>
              <span className='font-semibold text-ink-muted hover:text-ink-dim'>بازگشت</span>
            </button>
            <p className='text-ink-text font-bold text-xl'>صفحه ای که دنبالش بودید پیدا نشد</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default NotFound;
