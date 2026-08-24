import { useMutation } from '@tanstack/react-query';
import toast from '../../ui/toast';
import { changeProposalStatusAPI } from '../../services/proposalService';


function useChangeProposalStatus() {

  const { isPending: isUpdating, mutate: changeProposalStatus } = useMutation({
    mutationFn: changeProposalStatusAPI,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  });

  return { isUpdating, changeProposalStatus };
}

export default useChangeProposalStatus
