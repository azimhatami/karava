import { Outlet } from 'react-router-dom';


function AppLayout() {
  return(
    <div className='grid grid-rows-[auto_1fr] grid-cols-[15rem_1fr] h-screen'>
      <div className='bg-secondary-0 py-4 px-8'>App Header</div>
      <div className='bg-secondary-0 row-start-1 row-span-2'>App Sidebar</div>
      <div className='bg-secondary-100 p-8 overflow-y-auto'>
        <div className='mx-auto max-w-screen-md bg-red-300'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}


export default AppLayout
