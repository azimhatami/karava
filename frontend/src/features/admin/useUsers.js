import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/authService';


function useUsers() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  const users = data?.users ?? [];

  return { isLoading, isError, users };
}


export default useUsers
