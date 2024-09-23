import { SQLConsole } from "./SQLConsole.tsx";
import { useEffect, useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import MessageBubble from "./molecule/MessageBubble.tsx";
import '../styles/ProblemStepView.css';
import { ChatMessage } from "../types/chat-message.ts";
import TypingAnimation from "./atom/IsTypingAnimation.tsx";

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolutionSubmitted, setIsSolutionSubmitted] = useState(false);
  const [isSQLConsoleOpen, setIsSQLConsoleOpen] = useState(false);
  const [messageLog, setMessageLog] = useState<ChatMessage[]>([]);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessageLog([]);
  }, []);

  useEffect(() => {
      const messagePoller = setInterval(() => {
        const message = messageQueue.shift();
        if (message) {
          setMessageLog(prevLog => prevLog.concat({
            message,
            participantType: "mentor"
          }));
        }
      }, 1750);

      return () => {
        clearInterval(messagePoller);
      };
  }, [messageQueue]);

  useEffect(() => {
    setIsSolutionSubmitted(false);
    setMessageQueue(messageQueue.concat(currentStep.messages));
  }, [currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messageLog]);

  useEffect(() => {
    setIsSQLConsoleOpen(false);
    if (isSolutionSubmitted) {
      setMessageLog(prevLog => prevLog.concat({
        message: currentStep.success,
        participantType: "user"
      }));
      setMessageLog(prevLog => prevLog.concat({
        participantType: "submittedResult"
      }));
      onNextClicked();
    }
  }, [isSolutionSubmitted])

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
          <MessageBubble key={index} chatMessage={chatMessage} />
        ))}
        { messageQueue.length > 0 && <TypingAnimation/> }
        <div ref={messageEndRef}/>
      </div>
      {/*Only when it's time to do something...*/}
      { messageQueue.length == 0 && <button onClick={() => setIsSQLConsoleOpen(true)}>[Connect to Database] One moment...</button> }
      { isSQLConsoleOpen && <SQLConsole db={db} setIsSolutionSubmitted={setIsSolutionSubmitted} expectedRows={currentStep.expectedRows} /> }
    </>
  );
}
