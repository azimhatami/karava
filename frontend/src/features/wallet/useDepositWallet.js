import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { depositWalletAPI } from '../../services/walletService';

function useDepositWallet() {
  const queryClient = useQueryClient();

  const { isPending: isDepositing, mutate: depositWallet } = useMutation({
    mutationFn: depositWalletAPI,
    onSuccess: (data) => {
      toast.success(data.message || 'شارژ آزمایشی انجام شد');
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'شارژ کیف پول انجام نشد.'));
    },
  });

  return { isDepositing, depositWallet };
}

export default useDepositWallet;
