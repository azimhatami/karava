import AppLayout from '../../ui/AppLayout';
import Sidebar from '../../ui/Sidebar';
import CustomNavLink from '../../ui/CustomNavLink';

import { HiHome, HiCollection } from "react-icons/hi";


function FreelancerLayout() {
  return(
    <AppLayout>
      <Sidebar>
        <CustomNavLink to='dashboard'>
          <HiHome />
          <span>
            داشبورد
          </span>
        </CustomNavLink>
        <CustomNavLink to='projects'>
          <HiCollection />
          <span>
          پروژه ها
          </span>
        </CustomNavLink>
        <CustomNavLink to='proposals'>
          <HiCollection />
          <span>
            درخواست ها
          </span>
        </CustomNavLink>
      </Sidebar>
    </AppLayout>
  );
}


export default FreelancerLayout
