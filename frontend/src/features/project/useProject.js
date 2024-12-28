import { useQuery } from '@tanstack/react-query';
import { getProjectAPI } from '../../services/projectService';
import { useParams } from 'react-router-dom';


function useProject() {
  const { id } = useParams();

  const {data, isLoading} = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectAPI(id),
    retry: false,
  });

  const { project } = data || {};

  return { isLoading, project };
}


export default useProject
