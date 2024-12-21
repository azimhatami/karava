import { useQuery } from '@tanstack/react-query';
import { getOwnerProjectsAPI } from '../../services/projectService';


function useOwnerProjects() {
  const {data, isLoading} = useQuery({
    queryKey: ['projects'],
    queryFn: getOwnerProjectsAPI,
  });

  const {projects} = data || {};

  return { isLoading, projects };
}


export default useOwnerProjects
