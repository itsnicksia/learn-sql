import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { Problem } from "../types/problem.ts";
import { DEBUG, PROBLEM_SCHEMA } from "../config.ts";
import { DebugToolbar } from "./DebugToolbar.tsx";
import { ProblemStepView } from "./ProblemStepView.tsx";

interface Props {
  problem: Problem;
  setProblemPath: Dispatch<SetStateAction<string>>;
  db: PGlite;
}

export function ProblemView({ problem, setProblemPath, db }: Props) {
  const [stepIndex, setStepIndex] = useState(0);

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

  const currentStep = problem.steps ? problem.steps[stepIndex] : null;

  return (
    <>
      <h4>{problem.title}</h4>
      {currentStep && <ProblemStepView db={db} currentStep={currentStep} onNextClicked={onNextClicked} />}
      { false && DEBUG && <DebugToolbar onNextClicked={onNextClicked} />}
    </>
  );
}
