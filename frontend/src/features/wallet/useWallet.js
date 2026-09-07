import { useQuery } from '@tanstack/react-query';
import { getWalletAPI } from '../../services/walletService';

function useWallet(page = 1) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wallet', page],
    queryFn: () => getWalletAPI({ page, limit: 10 }),
    retry: (failureCount, queryError) => {
      if (queryError?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  return {
    isLoading,
    isError,
    error,
    isMock: data?.isMock !== false,
    wallet: data?.wallet || { balance: 0, heldBalance: 0 },
    transactions: data?.transactions || [],
    pagination: data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
}

export default useWallet;
