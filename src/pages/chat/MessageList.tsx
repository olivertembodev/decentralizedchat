import { MessageList as Element } from 'react-chat-elements';

interface Props {
  messages: any[];
}

export default function MessageList({ messages }: Props) {
  return (
    <Element
      className="message-list"
      lockable={true}
      toBottomHeight={'100%'}
      dataSource={messages}
    />
  );
}
