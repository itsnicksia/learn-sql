import { SQLView } from "./SQLView.tsx";
import { useEffect, useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import { ProblemStepStatus } from "./molecule/ProblemStepStatus.tsx";
import MessageBubble from "./molecule/MessageBubble.tsx";
import '../styles/ProblemStepView.css';

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolved, setIsSolved] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageLog, setMessageLog] = useState<string[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(`${messageIndex + 1}/${currentStep.messages.length}`);
    setMessageLog(messageLog.concat(currentStep.messages[messageIndex]));
    if (messageIndex < currentStep.messages.length - 1) {
      let timeout = setTimeout(() => {
        setMessageIndex(messageIndex + 1);
      }, 1750);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [messageIndex]);

  useEffect(() => {
    setIsSolved(false);
    setMessageIndex(0);
  }, [currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messageLog]);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <ProblemStepStatus isSolved={isSolved} solvedText={currentStep.success} onNextClicked={onNextClicked} />
      <div className={"problem-step-view"}>
        {messageLog.map((message, index) => (
          <MessageBubble key={index} message={message} type={"narrator"} />
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <SQLView db={db} setIsSolved={setIsSolved} expectedRows={currentStep.expectedRows} />
    </>
  );
}
