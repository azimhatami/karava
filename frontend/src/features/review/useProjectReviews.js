import { useQuery } from '@tanstack/react-query';
import { getReviewsForProjectAPI } from '../../services/reviewService';

function useProjectReviews(projectId, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['project-reviews', projectId],
    queryFn: () => getReviewsForProjectAPI(projectId),
    enabled: Boolean(projectId) && enabled,
  });

  return {
    isLoading,
    isError,
    error,
    refetch,
    reviews: data?.reviews || [],
    myReview: data?.myReview || null,
    canReview: Boolean(data?.canReview),
  };
}

export default useProjectReviews;
