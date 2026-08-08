import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router';
import { resetAuthRefreshState } from '../../services/httpService';


function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isPending, mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      resetAuthRefreshState();
      queryClient.removeQueries();
      navigate('/auth', { replace: true });
    },
  });

  return { isPending, logout };
}


export default useLogout
