import { SQLView } from "./SQLView.tsx";
import { useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import ReactMarkdown from "react-markdown";
import { ProblemStepStatus } from "./molecule/ProblemStepStatus.tsx";

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolved, setIsSolved] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const [messageLog, setMessageLog] = useState<string[]>([]);

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

  return (
    <>
      <ProblemStepStatus isSolved={isSolved} solvedText={currentStep.success} onNextClicked={onNextClicked} />
      <div style={{ width: "600px", textAlign: "left", margin: "auto", padding: "10px" }}>
        { messageLog.map(( (message, index) => <ReactMarkdown key={index} children={message} />))}
      </div>
      <SQLView db={db} setIsSolved={setIsSolved} expectedRows={currentStep.expectedRows} />
    </>
  );
}
