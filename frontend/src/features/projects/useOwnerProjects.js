import { useQuery } from '@tanstack/react-query';
import { getOwnerProjectsAPI } from '../../services/projectService';


function useOwnerProjects() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['owner-projects'],
    queryFn: getOwnerProjectsAPI,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const projects = data?.projects ?? [];

  return { isLoading, isError, projects };
}


export default useOwnerProjects
