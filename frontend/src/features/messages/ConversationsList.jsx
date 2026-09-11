import { Link } from 'react-router-dom';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { useConversations } from './useConversations';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';

function ConversationsList({ basePath }) {
  const { conversations, isLoading, isError, error, refetch } =
    useConversations();

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }
  if (!conversations.length) {
    return (
      <Empty
        resourceName="گفتگویی"
        title="هنوز گفتگویی ندارید"
        description="پس از پذیرش پیشنهاد، گفتگو از صفحه پروژه بین کارفرما و فریلنسر آغاز می‌شود."
        icon={HiOutlineChatBubbleLeftRight}
      />
    );
  }

  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="owner-panel-title">گفتگوها</h3>
      <div className="ink-card overflow-hidden">
        <ul className="divide-y divide-ink-hair">
          {conversations.map((item) => (
            <li key={item._id}>
              <Link
                to={`${basePath}/${item._id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#FBFAF6]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-ink-raised text-ink-mint">
                    <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 text-right">
                    <p className="truncate text-[14.5px] font-bold text-ink-text">
                      {item.counterpart?.name || 'کاربر'}
                    </p>
                    <p className="mt-1 truncate text-[12.5px] text-ink-mint-mid">
                      {item.project?.title || 'پروژه'}
                    </p>
                    <p className="mt-1 truncate text-[12.5px] text-ink-muted">
                      {item.lastMessage?.text
                        ? truncateText(item.lastMessage.text, 48)
                        : 'هنوز پیامی نیست'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[11.5px] text-ink-dim">
                    {item.lastMessage?.createdAt
                      ? shortDate(item.lastMessage.createdAt)
                      : ''}
                  </span>
                  {item.unreadCount > 0 ? (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink-mint px-1.5 text-[11px] font-bold text-ink">
                      {item.unreadCount}
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ConversationsList;
