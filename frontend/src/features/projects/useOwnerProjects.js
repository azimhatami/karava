import { useQuery } from '@tanstack/react-query';
import { getOwnerProjectsAPI } from '../../services/projectService';


function useOwnerProjects() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['owner-projects'],
    queryFn: getOwnerProjectsAPI,
    retry: (failureCount, queryError) => {
      if (queryError?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const projects = data?.projects ?? [];

  return { isLoading, isError, error, refetch, projects };
}


export default useOwnerProjects
