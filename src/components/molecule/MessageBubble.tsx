import '../organisms/MessageLogView.css';
import csvIcon from '../../assets/csv-icon.png';
import ReactMarkdown from "react-markdown";
import {ChatMessage} from "../../types/chat-message.ts"; // Custom CSS for styling the bubbles

interface Props {
  chatMessage: ChatMessage
}

function MessageBubble({ chatMessage }: Props) {
  const { participantType } = chatMessage;
  const name = participantType === "mentor" ? "Deebee" : "You";
  return (
    <div className={`message-bubble-container ${participantType}`}>
      <div className="message-content">
        <div className={`message-bubble ${participantType}`}>
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
  switch (chatMessage.participantType) {
    case "user":
    case "mentor":
      return <ReactMarkdown children={chatMessage.message}/>
    case "submittedResult":
      return <div>
        <img src={csvIcon} style={{height: "32px", width: "32px"}} alt="Your submitted report"/>
        <span>results.csv</span>
      </div>
    case "tip":
    case "summary":
      return <p>Error: {chatMessage.participantType} messages not yet implemented!</p>
  }
}

export default MessageBubble;
