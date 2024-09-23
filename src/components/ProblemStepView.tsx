import { SQLConsole } from "./SQLConsole.tsx";
import { useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import '../styles/ProblemStepView.css';
import { ChatMessage } from "../types/chat-message.ts";
import {MessageLogView} from "./MessageLogView.tsx";

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolutionSubmitted, setIsSolutionSubmitted] = useState(false);
  const [isSQLConsoleOpen, setIsSQLConsoleOpen] = useState(false);
  const [messageLog, setMessageLog] = useState<ChatMessage[]>([]);
  const [messageQueue, setMessageQueue] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessageLog([]);
  }, []);

  useEffect(() => {
      const messagePoller = setInterval(() => {
        const message = messageQueue.shift();
        if (message) {
          setMessageLog(prevLog => prevLog.concat(message));
        }
      }, 1750);

      return () => {
        clearInterval(messagePoller);
      };
  }, [messageQueue]);

  useEffect(() => {
    setIsSolutionSubmitted(false);
    setMessageQueue(messageQueue.concat(currentStep.messages.map(message => ({ participantType: "mentor", message }))));
  }, [currentStep]);

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

  return (
    <>
      <MessageLogView messageLog={messageLog} messageQueue={messageQueue}/>
      { <button disabled={messageQueue.length !== 0} onClick={() => setIsSQLConsoleOpen(true)}>Connect to Database</button> }
      { isSQLConsoleOpen && <SQLConsole db={db} setIsSolutionSubmitted={setIsSolutionSubmitted} expectedRows={currentStep.expectedRows} onCloseClicked={() => setIsSQLConsoleOpen(false)}/> }
    </>
  );
}
