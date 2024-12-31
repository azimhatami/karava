
function Sidebar({ children }) {

  return(
    <>
      <div className='bg-secondary-0 row-start-1 row-span-2 border-l border-secondary-200 p-4'>
        <ul className='flex flex-col gap-y-3'>
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
