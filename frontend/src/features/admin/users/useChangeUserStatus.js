import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { changeUserStatusAPI } from '../../../services/authService';


function useChangeUserStatus() {

  const { isPending: isUpdating, mutate: changeUserStatus } = useMutation({
    mutationFn: changeUserStatusAPI,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  });

  return { isUpdating, changeUserStatus };
}

export default useChangeUserStatus
