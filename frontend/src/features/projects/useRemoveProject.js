import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProjectAPI } from '../../services/projectService';
import { toast } from 'react-hot-toast';


function useRemoveProject() {

  const queryClient = useQueryClient();

  const { mutate: removeProject, isPending: isDeleting } = useMutation({
    mutationFn: removeProjectAPI,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ['owner-projects']
      })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  })

  return { removeProject, isDeleting };
}


export default useRemoveProject
