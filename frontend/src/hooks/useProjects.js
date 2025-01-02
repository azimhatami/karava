import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI } from '../services/projectService';


function useProjects() {
  const {data, isLoading} = useQuery({
    queryKey: ['projects'],
    queryFn: getProjectsAPI,
  });

  const {projects} = data || {};

  return { isLoading, projects };
}


export default useProjects
