import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { changeProposalStatusAPI } from '../../services/proposalService';


function useChangeProposalStatus() {
  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate: changeProposalStatus } = useMutation({
    mutationFn: changeProposalStatusAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['owner-projects'] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'تغییر وضعیت پیشنهاد انجام نشد.'));
    },
  });

  return { isUpdating, changeProposalStatus };
}

export default useChangeProposalStatus
