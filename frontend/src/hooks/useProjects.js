import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI } from '../services/projectService';
import { useLocation } from 'react-router'


function useProjects() {
  const { search } = useLocation();
  const queryObject = Object.fromEntries(new URLSearchParams(search));
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['projects', queryObject],
    queryFn: () => getProjectsAPI(search),
    retry: (failureCount, queryError) => {
      if (queryError?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const projects = data?.projects ?? [];

  return { isLoading, isError, error, refetch, projects };
}


export default useProjects
