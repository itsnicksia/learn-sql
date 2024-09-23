import '../../styles/MessageBubble.css';
import ReactMarkdown from "react-markdown";
import {ChatMessage} from "../../types/chat-message.ts"; // Custom CSS for styling the bubbles

interface Props {
  chatMessage: ChatMessage
}

const MessageBubble = ({ chatMessage }: Props) => {
  const { message, participantType } = chatMessage;
  const name = participantType === "mentor" ? "Ally McBeal" : "You";
  return (
    <div className={`message-bubble-container ${participantType}`}>
      <div className="message-content">
        <div className={`message-bubble ${participantType}`}>
          <ReactMarkdown children={message} />
        </div>
        <div>
          <div className="name">{name}</div>
          <div className="timestamp">{new Date().toISOString()}</div>
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
