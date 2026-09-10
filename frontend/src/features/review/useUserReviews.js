import { useQuery } from '@tanstack/react-query';
import { getReviewsForUserAPI } from '../../services/reviewService';

function useUserReviews(userId, page = 1) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user-reviews', userId, page],
    queryFn: () => getReviewsForUserAPI(userId, { page, limit: 20 }),
    enabled: Boolean(userId),
    retry: (failureCount, queryError) => {
      if (queryError?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });

  return {
    isLoading,
    isError,
    error,
    refetch,
    user: data?.user || null,
    reviews: data?.reviews || [],
    averageRating: data?.averageRating || 0,
    totalReviews: data?.totalReviews || 0,
    pagination: data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    },
  };
}

export default useUserReviews;
