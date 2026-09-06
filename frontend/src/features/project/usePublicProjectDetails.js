import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getPublicProjectDetailsAPI } from '../../services/projectService';

function usePublicProjectDetails() {
  const { projectId } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project-details', projectId],
    queryFn: () => getPublicProjectDetailsAPI(projectId),
    enabled: Boolean(projectId),
    retry: (failureCount, err) => {
      if (err?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  return {
    projectId,
    isLoading,
    isError,
    error,
    refetch,
    project: data?.project,
    myProposal: data?.myProposal || null,
  };
}

export default usePublicProjectDetails;
