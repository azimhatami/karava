import { useQuery } from '@tanstack/react-query';
import { getProjectAPI } from '../../services/projectService';
import { useParams } from 'react-router-dom';

function useProject() {
  const { id } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectAPI(id),
    retry: false,
  });

  const { project } = data || {};

  return { isLoading, isError, error, refetch, project };
}

export default useProject;
