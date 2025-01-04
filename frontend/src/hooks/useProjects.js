import { useQuery } from '@tanstack/react-query';
import { getProjectsAPI } from '../services/projectService';
import { useLocation } from 'react-router'

import queryString from 'query-string';


function useProjects() {
  const { search } = useLocation();
  // const queryObject = queryString.parse(search);
  const queryObject = Object.fromEntries(new URLSearchParams(search));
  const {data, isLoading} = useQuery({
    queryKey: ['projects', queryObject],
    queryFn: () => getProjectsAPI(search),
  });

  const {projects} = data || {};

  return { isLoading, projects };
}


export default useProjects
