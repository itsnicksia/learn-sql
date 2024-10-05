import '../organisms/MessageLogView.css';
import csvIcon from '../../assets/csv-icon.png';
import ReactMarkdown from "react-markdown";
import {ChatMessage} from "../../types/chat-message.ts"; // Custom CSS for styling the bubbles

interface Props {
  chatMessage: ChatMessage
}

function MessageBubble({ chatMessage }: Props) {
  const { messageType } = chatMessage;
  const name = messageType === "mentor" ? "Deebee" : "You";

  return (
    <div className={`message-bubble-container ${messageType}`}>
      <div className="message-content">
        <div className={`message-bubble ${messageType}`}>
          { renderMessageBody(chatMessage) }
        </div>
        <div>
          <div className="name">{name}</div>
        </div>
      </div>
    </div>
  );
}

function renderMessageBody(chatMessage: ChatMessage) {
  switch (chatMessage.messageType) {
    case "user":
    case "mentor":
    case "important":
      return <ReactMarkdown children={chatMessage.message}/>
    case "submittedResult":
      return <div>
        <img src={csvIcon} style={{height: "32px", width: "32px"}} alt="Your submitted report"/>
      </div>
    case "tip":
    case "summary":
      return <p>Error: {chatMessage.messageType} messages not yet implemented!</p>
  }
}

export default MessageBubble;
