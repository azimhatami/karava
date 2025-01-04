import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/authService';
import { useLocation } from 'react-router'

import queryString from 'query-string';


function useUsers() {
  const {data, isLoading} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { users } = data || {};

  return { isLoading, users };
}


export default useUsers
