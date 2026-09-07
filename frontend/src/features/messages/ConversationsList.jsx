import { Link } from 'react-router-dom';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { useConversations } from './useConversations';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import truncateText from '../../utils/truncateText';
import shortDate from '../../utils/shortDate';

function ConversationsList({ basePath }) {
  const { conversations, isLoading } = useConversations();

  if (isLoading) return <Loading />;
  if (!conversations.length) {
    return (
      <Empty resourceName="گفتگویی" />
    );
  }

  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="owner-panel-title">گفتگوها</h3>
      <div className="overflow-hidden rounded-[12px] border border-[#245A49] bg-white">
        <ul className="divide-y divide-[#E5E7EB]">
          {conversations.map((item) => (
            <li key={item._id}>
              <Link
                to={`${basePath}/${item._id}`}
                className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-[#F2FFF8]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F3EE] text-[#006045]">
                    <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-bold text-[#222020]">
                      {item.counterpart?.name || 'کاربر'}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#006045]">
                      {item.project?.title || 'پروژه'}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#6E6E6E]">
                      {item.lastMessage?.text
                        ? truncateText(item.lastMessage.text, 48)
                        : 'هنوز پیامی نیست'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[11px] text-[#9CA3AF]">
                    {item.lastMessage?.createdAt
                      ? shortDate(item.lastMessage.createdAt)
                      : ''}
                  </span>
                  {item.unreadCount > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#C9093D] px-1.5 py-0.5 text-[10px] font-bold text-white">
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
