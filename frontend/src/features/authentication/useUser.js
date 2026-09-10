import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../services/authService';


function useUser() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { user } = data || {};

  return { isLoading, isError, error, refetch, user };
}


export default useUser
