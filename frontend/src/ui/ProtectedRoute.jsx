import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from './toast';

import useAuthorize from '../features/authentication/useAuthorize';
import Loading from './Loading';


function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthorized, isLoading, isVerified } = useAuthorize();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

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
  }, [isAuthenticated, isAuthorized, isLoading, navigate, isVerified]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-secondary-100'>
        <Loading />
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


export default ProtectedRoute
