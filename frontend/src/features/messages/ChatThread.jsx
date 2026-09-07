import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlinePaperAirplane } from 'react-icons/hi2';
import {
  getConversationMessagesAPI,
  sendConversationMessageAPI,
} from '../../services/conversationService';
import useUser from '../authentication/useUser';
import Loading from '../../ui/Loading';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import shortDate from '../../utils/shortDate';

function ChatThread({ conversationId, backPath }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => getConversationMessagesAPI(conversationId),
    enabled: Boolean(conversationId) && Boolean(user),
    refetchInterval: conversationId && user ? 5_000 : false,
  });

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendConversationMessageAPI,
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({
        queryKey: ['conversation-messages', conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations-unread'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'ارسال پیام انجام نشد'));
    },
  });

  const messages = data?.messages || [];
  const conversation = data?.conversation;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, conversationId]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['conversations-unread'] });
  }, [messages, queryClient]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loading />
      </div>
    );
  }

  if (isError || !conversation) {
    return (
      <div className="rounded-[12px] border border-[#F9A8D4] bg-[#FFF1F2] p-6 text-center text-sm text-[#BE185D]">
        دسترسی به این گفتگو ممکن نیست یا گفتگو یافت نشد.
        <div className="mt-3">
          <Link to={backPath} className="font-bold text-[#006045]">
            بازگشت به لیست گفتگوها
          </Link>
        </div>
      </div>
    );
  }

  const counterpart =
    String(conversation.owner?._id) === String(user?._id)
      ? conversation.freelancer
      : conversation.owner;

  const onSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    sendMessage({ conversationId, text: trimmed });
  };

  return (
    <div className="flex h-[640px] w-full flex-col overflow-hidden rounded-[12px] border border-[#245A49] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-4 py-3">
        <div className="min-w-0 text-right">
          <p className="truncate text-sm font-bold text-[#222020]">
            {counterpart?.name || 'کاربر'}
          </p>
          <p className="mt-1 truncate text-xs text-[#6E6E6E]">
            پروژه: {conversation.project?.title || '—'}
          </p>
        </div>
        <Link
          to={backPath}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#006045]"
        >
          <HiOutlineArrowRight className="h-4 w-4" />
          بازگشت
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#F8FFFC] p-4">
        {messages.length ? (
          messages.map((message) => {
            const mine = String(message.sender?._id || message.sender) === String(user?._id);
            return (
              <div
                key={message._id}
                className={`flex ${mine ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] rounded-[12px] px-3 py-2 text-sm leading-6 ${
                    mine
                      ? 'bg-[#006045] text-white'
                      : 'border border-[#D1D5DB] bg-white text-[#222020]'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      mine ? 'text-white/80' : 'text-[#9CA3AF]'
                    }`}
                  >
                    {message.createdAt ? shortDate(message.createdAt) : ''}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-10 text-center text-sm text-[#6E6E6E]">
            هنوز پیامی رد و بدل نشده. اولین پیام را ارسال کنید.
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 border-t border-[#E5E7EB] bg-white p-3"
      >
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#006045] text-white transition-colors hover:bg-[#004d37] disabled:opacity-50"
          aria-label="ارسال"
        >
          <HiOutlinePaperAirplane className="h-5 w-5 -rotate-90" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 2000))}
          placeholder="پیام خود را بنویسید..."
          className="h-11 w-full rounded-[10px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-sm text-[#222020] outline-none focus:border-[#006045]"
          maxLength={2000}
        />
      </form>
    </div>
  );
}

export default ChatThread;
