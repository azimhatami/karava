import { useLocation } from 'react-router';
import useUser from './useUser';

function useAuthorize() {
  const { isLoading, isError, error, user } = useUser();
  const { pathname } = useLocation();

  const isAuthFailure =
    error?.response?.status === 401 || error?.response?.status === 403;

  let isAuthenticated = false;
  if (user) isAuthenticated = true;

  let isAuthorized = false;

  let isVerified = false;
  if (user && Number(user.status) === 2) isVerified = true;

  const ROLES = {
    admin: 'ADMIN',
    freelancer: 'FREELANCER',
    owner: 'OWNER',
  };

  const desiredRole = pathname.split('/').at(1);

  if (Object.keys(ROLES).includes(desiredRole)) {
    if (user && user.role === ROLES[desiredRole]) isAuthorized = true;
  }

  return {
    isLoading,
    isError: isError && !isAuthFailure,
    isAuthenticated,
    isAuthorized,
    user,
    isVerified,
  };
}

export default useAuthorize;
