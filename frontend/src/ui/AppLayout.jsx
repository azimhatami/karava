import { Outlet } from 'react-router-dom';
import Header from './Header'


function AppLayout({children}) {
  return(
    <div className='grid grid-rows-[auto_100%_auto] grid-cols-[1fr] md:grid md:grid-rows-[auto_1fr] md:grid-cols-[15rem_1fr] md:h-screen'>
      <Header />
      {children}
      {/* <Sidebar /> */}
      <div className='bg-ink-well p-8 overflow-y-auto w-full h-[100%]'>
        <div className='mx-auto max-w-screen-lg'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}


export default AppLayout
