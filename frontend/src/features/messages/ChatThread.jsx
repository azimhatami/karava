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

  const { data, isLoading, isError, refetch } = useQuery({
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
      <div className="rounded-2xl border border-[#F0C2CE] bg-[#FDF2F5] p-6 text-center">
        <p className="text-sm font-bold text-[#C9093D]">
          دسترسی به این گفتگو ممکن نیست یا گفتگو یافت نشد.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="ink-btn-ghost"
          >
            تلاش مجدد
          </button>
          <Link
            to={backPath}
            className="ink-btn-primary"
          >
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
    <div className="ink-card flex h-[min(640px,calc(100dvh-12rem))] w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-ink-hair px-5 py-4">
        <div className="min-w-0 text-right">
          <p className="truncate text-[15px] font-bold text-ink-text">
            {counterpart?.name || 'کاربر'}
          </p>
          <p className="mt-1 truncate text-[12.5px] text-ink-muted">
            پروژه: {conversation.project?.title || '—'}
          </p>
        </div>
        <Link
          to={backPath}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
        >
          <HiOutlineArrowRight className="h-4 w-4" />
          بازگشت
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-ink-paper p-5">
        {messages.length ? (
          messages.map((message) => {
            const mine = String(message.sender?._id || message.sender) === String(user?._id);
            return (
              <div
                key={message._id}
                className={`flex ${mine ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-7 ${
                    mine
                      ? 'bg-ink-raised text-[#F2F6F4]'
                      : 'border border-ink-line bg-ink-card text-ink-text'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      mine ? 'text-ink-mint/80' : 'text-ink-dim'
                    }`}
                  >
                    {message.createdAt ? shortDate(message.createdAt) : ''}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-[15px] font-bold text-ink-text">
              هنوز پیامی رد و بدل نشده
            </p>
            <p className="text-[13px] text-ink-muted">
              اولین پیام را ارسال کنید تا گفتگو شروع شود.
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2.5 border-t border-ink-hair bg-ink-card p-3.5"
      >
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-ink-mint text-ink transition-[filter] hover:brightness-105 disabled:opacity-40"
          aria-label="ارسال"
        >
          <HiOutlinePaperAirplane className="h-5 w-5 -rotate-90" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 2000))}
          placeholder="پیام خود را بنویسید..."
          className="ink-input"
          maxLength={2000}
        />
      </form>
    </div>
  );
}

export default ChatThread;
