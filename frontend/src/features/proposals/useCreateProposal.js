import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import { createProposalAPI } from '../../services/proposalService';


function useCreateProposal() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createProposal } = useMutation({
    mutationFn: createProposalAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ['proposals']
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  });

  return { isCreating, createProposal }
}


export default useCreateProposal
