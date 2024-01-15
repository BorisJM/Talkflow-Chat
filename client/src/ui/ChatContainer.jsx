import { uniqBy } from "lodash";
import { useSelector } from "react-redux";
import Message from "./Message";
import TypingAnimation from "./TypingAnimation";

function ChatContainer({ children, onLoad , showTyping}) {
  const { selectedUser } = useSelector((state) => state.users);
  const { messages } = useSelector((state) => state.messages);
  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className=" flex transition-all duration-200 dark:bg-[#2b303b] flex-col gap-4 overflow-y-scroll overflow-x-hidden w-full h-full p-3">
      {messagesWithoutDupes.map((m) => (
        <Message
          onLoad={onLoad}
          image={m.image}
          key={m._id}
          text={m.text}
          side={m.receiver === selectedUser.userId ? "text-right" : "text-left"}
          bg={
            m.receiver === selectedUser.userId ? "bg-blue-400" : "bg-zinc-700"
          }
          selfSide={
            m.receiver === selectedUser.userId ? "self-end" : "self-start"
          }
        />
      ))}
 {showTyping?.typing === 'typing' && showTyping.sender === selectedUser.userId && <TypingAnimation/>}
      {children}
    </div>
  );
}

export default ChatContainer;
