import { SQLView } from "./SQLView.tsx";
import { useEffect, useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import MessageBubble from "./molecule/MessageBubble.tsx";
import '../styles/ProblemStepView.css';
import { ChatMessage } from "../types/chat-message.ts";

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolved, setIsSolved] = useState(false);
  const [messageLog, setMessageLog] = useState<ChatMessage[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const [messageQueue, setMessageQueue] = useState<string[]>([]);

  useEffect(() => {
      let messagePoller = setInterval(() => {
        const message = messageQueue.shift();
        if (message) {
          setMessageLog(prevLog => prevLog.concat({
            message,
            participantType: "narrator"
          }));
        }
      }, 1750);

      return () => {
        clearInterval(messagePoller);
      };
  }, [messageQueue]);

  useEffect(() => {
    setIsSolved(false);
    setMessageQueue(messageQueue.concat(currentStep.messages));
  }, [currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messageLog]);

  useEffect(() => {
    if (isSolved) {
      setMessageLog(prevLog => prevLog.concat({
        message: currentStep.success,
        participantType: "user"
      }));
      onNextClicked();
    }
  }, [isSolved])

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={"problem-step-view"}>
        {messageLog.map((chatMessage, index) => (
          <MessageBubble key={index} message={chatMessage.message} participantType={chatMessage.participantType} />
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <SQLView db={db} setIsSolved={setIsSolved} expectedRows={currentStep.expectedRows} />
    </>
  );
}
