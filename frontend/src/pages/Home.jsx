import { NavLink } from "react-router"

import useUser from '../features/authentication/useUser';
import useProjects from '../hooks/useProjects';
import Loading from '../ui/Loading';

const projectStatus = {
  OPEN: {
    label: 'باز',
    className: 'badge-success'
  },
  CLOSED: {
    label: 'بسته',
    className: 'badge-danger'
  },
};


function Home() {
  const { isLoding: userLoading, user } = useUser();
  const { isLoading: projectsLoading, projects } = useProjects();

  return(
    <div className='container h-screen bg-secondary-0 m-auto'>
      <div className='pt-8 xl:max-w-screen-xl flex items-center justify-between'>
        <div className='flex items-center gap-x-8'>
          <NavLink to='/'>
            <h2 className='text-lg font-bold text-secondary-500'>خانه</h2>
          </NavLink>
          <NavLink to='/admin/dashboard'>
            <p className='text-lg font-bold text-secondary-500'>داشبورد</p>
          </NavLink>
        </div>
        { userLoading ? <Loading /> : (
          <p className='text-lg forn-bold text-secondary-600'>{user?.name} به وبسایت FreelancerHub خوش امدید</p>
        )}
      </div>
      <div className=''>
        <div className='container mt-16 flex items-center justify-normal flex-wrap gap-y-5 gap-x-6'>
          {projectsLoading ? <Loading /> : (
            projects.map((project) => {
              return(
                <div key={project._id} className='border border-[1px] border-secondary-400 w-[24rem] h-[8rem] rounded-md p-2'>
                  <div className='flex items-center justify-between'>
                  <h2 className='text-xl text-secondary-800 mb-2 inline'>{project.title}</h2>
                  <span className={`badge ${projectStatus[project.status].className}`}>{projectStatus[project.status].label}</span>
                  </div>
                  <p className='text-secondary-500 text-sm'>{project.description}</p>
                  <div className='mt-6 flex items-center justify-stretch gap-x-2'>{project.tags.map((t) => <span key={t} className='badge badge-secondary'>{t}</span>)}</div>
                </div>
              );
            })
          )
          }
        </div>
      </div>
    </div>
  );
}


export default Home;
