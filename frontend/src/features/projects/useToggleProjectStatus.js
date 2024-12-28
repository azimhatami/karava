import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { toggleProjectStatusAPI } from '../../services/projectService';


function useToggleProjectStatus() {
  const queryClient = useQueryClient();

  const { isPending: isToggling, mutate: toggleProjectStatus } = useMutation({
    mutationFn: toggleProjectStatusAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ['owner-projects']
      }) 
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  });

  return { isToggling, toggleProjectStatus };
}


export default useToggleProjectStatus
