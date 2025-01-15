import AppLayout from '../../ui/AppLayout';
import Sidebar from '../../ui/Sidebar';
import CustomNavLink from '../../ui/CustomNavLink';

import { HiHome, HiCollection, HiUsers } from "react-icons/hi";


function AdminLayout() {
  return(
    <AppLayout>
      <Sidebar>
        <CustomNavLink to='dashboard'>
          <HiHome />
          <span className='md:inline hidden'>
            داشبورد
          </span>
        </CustomNavLink>
        <CustomNavLink to='projects'>
          <HiCollection />
          <span className='md:inline hidden'>
          پروژه ها
          </span>
        </CustomNavLink>
        <CustomNavLink to='proposals'>
          <HiCollection />
            <span className='md:inline hidden'>
            درخواست ها
            </span>
        </CustomNavLink>
        <CustomNavLink to='users'>
          <HiUsers />
          <span className='md:inline hidden'>
            کاربران
          </span>
        </CustomNavLink>
      </Sidebar>
    </AppLayout>
  );
}


export default AdminLayout
