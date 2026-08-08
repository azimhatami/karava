import { useQuery } from '@tanstack/react-query';
import { getUser } from '../../services/authService';


function useUser() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { user } = data || {};

  return { isLoading, isError, user };
}


export default useUser
