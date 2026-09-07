import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { completeProjectAPI } from '../../services/projectService';

function useCompleteProject() {
  const queryClient = useQueryClient();

  const { isPending: isCompleting, mutate: completeProject } = useMutation({
    mutationFn: completeProjectAPI,
    onSuccess: (data) => {
      toast.success(
        data.message || 'پروژه تکمیل شد و مبلغ به فریلنسر واریز گردید',
      );
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['owner-projects'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'تکمیل پروژه انجام نشد.'));
    },
  });

  return { isCompleting, completeProject };
}

export default useCompleteProject;
