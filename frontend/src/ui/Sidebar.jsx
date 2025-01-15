
function Sidebar({ children }) {

  return(
    <>
      <div 
        className='fixed bottom-0 left-0 right-0 md:relative bg-secondary-0 
          \ md:row-start-1 order-last md:row-span-2 md:border-l md:border-secondary-200 p-4 md:h-screen'
      >
        <ul className='flex md:items-start items-center md:justify-center justify-around md:flex md:flex-col md:gap-y-3'>
          {children}
          {/* <li>
            <CustomNavLink to='/owner/dashboard'>
              <HiHome />
              <span>
                داشبورد
              </span>
            </CustomNavLink>
          </li>
          <li>
            <CustomNavLink to='/owner/projects'>
              <HiCollection />
              <span>
              پروژه ها
              </span>
            </CustomNavLink>
          </li> */}
        </ul>
      </div>
    </>
  );
}


export default Sidebar
