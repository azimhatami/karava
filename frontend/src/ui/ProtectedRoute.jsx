import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from './toast';

import useAuthorize from '../features/authentication/useAuthorize';
import Loading from './Loading';
import QueryErrorState from './QueryErrorState';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthorized, isLoading, isError, isVerified } =
    useAuthorize();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || isError) return;

    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
      return;
    }

    if (!isVerified) {
      toast.error('پروفایل شما هنوز تایید نشده است');
      navigate('/', { replace: true });
      return;
    }

    if (!isAuthorized) {
      navigate('/', { replace: true });
    }
  }, [
    isAuthenticated,
    isAuthorized,
    isLoading,
    isError,
    navigate,
    isVerified,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-karava-bg-subtle">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-karava-bg-subtle px-4">
        <QueryErrorState
          message="بارگذاری اطلاعات حساب کاربری انجام نشد."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isAuthenticated && isAuthorized && isVerified) return children;

  return (
    <div className="flex h-screen items-center justify-center bg-karava-bg-subtle">
      <Loading />
    </div>
  );
}

export default ProtectedRoute;
