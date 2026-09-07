import { useParams } from 'react-router-dom';
import ConversationsList from '../features/messages/ConversationsList';
import ChatThread from '../features/messages/ChatThread';

function MessagesPage({ basePath }) {
  const { conversationId } = useParams();

  if (conversationId) {
    return <ChatThread conversationId={conversationId} backPath={basePath} />;
  }

  return <ConversationsList basePath={basePath} />;
}

export default MessagesPage;
