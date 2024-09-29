import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { Problem } from "../../types/problem.ts";
import { PROBLEM_SCHEMA } from "../../config.ts";
import { MessageLogView } from "../organisms/MessageLogView.tsx";
import { SQLConsole } from "../organisms/SQLConsole.tsx";
import { ChatMessage } from "../../types/chat-message.ts";

import "./ProblemView.css";

interface Props {
  problem: Problem;
  setProblemPath: Dispatch<SetStateAction<string>>;
  db: PGlite;
}

export function ProblemView({ problem, setProblemPath, db }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isSolutionSubmitted, setIsSolutionSubmitted] = useState(false);
  const [messageLog, setMessageLog] = useState<ChatMessage[]>([]);
  const [messageQueue, setMessageQueue] = useState<ChatMessage[]>([]);

  const currentStep = problem.steps && problem.steps[stepIndex];

  useEffect(() => {
    setMessageLog([{
      participantType: "mentor",
      message: "Welcome to Deedee Systems.",
    }]);
  }, []);

  useEffect(() => {
    const messagePoller = setInterval(() => {
      const message = messageQueue.shift();
      if (message) {
        setMessageLog(prevLog => prevLog.concat(message));
      }
    }, 1850);

    return () => {
      clearInterval(messagePoller);
    };
  }, [messageQueue]);

  useEffect(() => {
    if (currentStep) {
      setIsSolutionSubmitted(false);
      setMessageQueue(messageQueue.concat(currentStep.messages.map(message => ({
        participantType: "mentor",
        message
      }))));
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep && isSolutionSubmitted) {
      setMessageLog(prevLog => prevLog.concat({
        participantType: "submittedResult"
      }));
      onNextClicked();
    }
  }, [isSolutionSubmitted])

  /*
  Make sure everything's cleaned up before we start the next problem.
   */
  useEffect(() => {
    async function setup(db: PGlite, problem: Problem) {
      return await db.transaction(async (tx) => {
        await tx.exec(`DROP SCHEMA IF EXISTS ${PROBLEM_SCHEMA} CASCADE`);
        await tx.exec(`CREATE SCHEMA ${PROBLEM_SCHEMA}`);
        await tx.exec(`SET search_path TO ${PROBLEM_SCHEMA}`);
        return await tx.exec(problem.setupQuery);
      });
    }

    db && void setup(db, problem);
  }, [db, problem]);

  function onNextClicked() {
    if (!problem.steps) {
      // We ran out of content...
    } else if (stepIndex < problem.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(0);
      setProblemPath(problem.navigation.next);
    }
  }


  return (
    <div className={"problem-view"}>
      <div className={"title"}>
        <h4>{problem.title}</h4>
      </div>
      <div className={"message-log-view"}>
        <MessageLogView messageLog={messageLog} messageQueue={messageQueue}/>
      </div>
      <div className={"sql-console-view"}>
        <SQLConsole db={db} setIsSolutionSubmitted={setIsSolutionSubmitted} expectedRows={currentStep?.expectedRows} />
      </div>
      {/*{ false && DEBUG && <DebugToolbar onNextClicked={onNextClicked} />}*/}
    </div>
  );
}
