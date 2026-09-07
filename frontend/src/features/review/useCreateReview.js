import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { createReviewAPI } from '../../services/reviewService';

function useCreateReview() {
  const queryClient = useQueryClient();

  const { isPending: isSubmitting, mutate: createReview } = useMutation({
    mutationFn: createReviewAPI,
    onSuccess: (data, variables) => {
      toast.success(data.message || 'نظر شما ثبت شد');
      queryClient.invalidateQueries({
        queryKey: ['project-reviews', variables.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
      queryClient.invalidateQueries({ queryKey: ['project-details'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['owner-projects'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'ثبت نظر انجام نشد.'));
    },
  });

  return { isSubmitting, createReview };
}

export default useCreateReview;
