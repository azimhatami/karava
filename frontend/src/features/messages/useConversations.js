import { useQuery } from '@tanstack/react-query';
import { getConversationsAPI, getUnreadMessagesCountAPI } from '../../services/conversationService';
import useUser from '../authentication/useUser';

export function useConversations() {
  const { user } = useUser();
  const isAuthenticated = Boolean(user);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversationsAPI,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 15_000 : false,
  });

  return {
    conversations: data?.conversations || [],
    isLoading: isAuthenticated ? isLoading : false,
    isError: isAuthenticated ? isError : false,
    error: isAuthenticated ? error : null,
    refetch,
  };
}

export function useUnreadMessagesCount() {
  const { user } = useUser();
  const isAuthenticated = Boolean(user);

  const { data } = useQuery({
    queryKey: ['conversations-unread'],
    queryFn: getUnreadMessagesCountAPI,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 20_000 : false,
  });

  return data?.unreadCount || 0;
}
