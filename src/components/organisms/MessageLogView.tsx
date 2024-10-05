import MessageBubble from "../molecule/MessageBubble.tsx";
import TypingAnimation from "../atom/TypingAnimation.tsx";
import {ChatMessage} from "../../types/chat-message.ts";
import {useEffect, useRef} from "react";

interface Props {
  messageLog: ChatMessage[],
  messageQueue: ChatMessage[],
}

export function MessageLogView({messageLog, messageQueue}: Props) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageLog]);

  return (
    <div className={"message-log-view-2"}>
      {messageLog.map((chatMessage, index) => (
        <MessageBubble key={index} chatMessage={chatMessage}/>
      ))}
      {messageQueue.length > 0 && <TypingAnimation/>}
      <div ref={messageEndRef}/>
    </div>
  );
}

