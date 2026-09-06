import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import { createProjectAPI } from '../../services/projectService';
import { isProfileIncompleteError } from '../../utils/profileCompleteness';


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
      if (isProfileIncompleteError(error)) return;
      toast.error(error?.response?.data?.message)
    }
  });

  return { isCreating, createProject };
}


export default useCreateProject
