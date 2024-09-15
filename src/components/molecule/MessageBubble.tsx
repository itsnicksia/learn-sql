import '../../styles/MessageBubble.css';
import ReactMarkdown from "react-markdown"; // Custom CSS for styling the bubbles

interface Props {
  message: string
  participantType: "user" | "narrator"
}

const MessageBubble = ({ message, participantType }: Props) => {
  const name = participantType === "narrator" ? "Ally McBeal" : "You";
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
