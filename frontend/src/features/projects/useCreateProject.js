import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createProjectAPI } from '../../services/projectService';


function useCreateProject() {
  const queryClient = useQueryClient();

  const { isPending: isCreating, mutate: createProject } = useMutation({
    mutationFn: createProjectAPI,
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

  return { isCreating, createProject };
}


export default useCreateProject
