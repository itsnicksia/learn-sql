import '../../styles/MessageBubble.css';
import ReactMarkdown from "react-markdown"; // Custom CSS for styling the bubbles

interface Props {
  message: string
  type: "user" | "narrator"
}

const MessageBubble = ({ message, type }: Props) => {
  const name = type === "narrator" ? "Ally McBeal" : "You";
  return (
    <div className={`message-bubble-container ${type}`}>
      <div className="message-content">
        <div className={`message-bubble ${type}`}>
          <ReactMarkdown children={message} />
        </div>
        <span className="name">{name}</span>
        <span className="timestamp">{new Date().toISOString()}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
