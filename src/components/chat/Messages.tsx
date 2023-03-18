import { FC } from "react";
import Message, { MessageProps } from "./Message";

interface Props {
  messages: MessageProps[];
};

const Messages: FC<Props> = ({ messages }) => {
  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <Message 
          senderUsername={""}
          receiverUsername={""}
          avatarUrl={""}
          timestamp={""}
          content={""}
          likes={0}
          />
        </div>
      ))}
    </div>
  );
};

export default Messages;