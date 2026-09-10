import { useQuery } from '@tanstack/react-query';
import { getProposalsAPI } from '../../services/proposalService';


function useProposals() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['proposals'],
    queryFn: getProposalsAPI,
    retry: (failureCount, queryError) => {
      if (queryError?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const proposals = data?.proposals ?? [];

  return { isLoading, isError, error, refetch, proposals };
}

export default useProposals
