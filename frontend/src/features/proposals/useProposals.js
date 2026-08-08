import { useQuery } from '@tanstack/react-query';
import { getProposalsAPI } from '../../services/proposalService';


function useProposals() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['proposals'],
    queryFn: getProposalsAPI,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const proposals = data?.proposals ?? [];

  return { isLoading, isError, proposals };
}

export default useProposals
