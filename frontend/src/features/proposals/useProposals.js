import { useQuery } from '@tanstack/react-query';
import { getProposalsAPI } from '../../services/proposalService';


function useProposals() {
  const { data, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: getProposalsAPI
  });

  const { proposals } = data || {};

  return { isLoading, proposals };
}

export default useProposals
