import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { editProjectAPI } from '../../services/projectService';


function useEditProject() {
  const queryClient = useQueryClient();

  const { isPending: isEditing, mutate: editProject } = useMutation({
    mutationFn: editProjectAPI,
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

  return { isEditing, editProject };
}

export default useEditProject
