import {SQLView} from "./SQLView.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PGlite} from "@electric-sql/pglite";
import {Problem} from "../types/problem.ts";
import ReactMarkdown from "react-markdown";
import loadDb from "../hooks/load-database.ts";
import { Repl } from '@electric-sql/pglite-repl'
import {DEBUG, PROBLEM_SCHEMA} from "../config.ts";

interface Props {
  problem: Problem,
  setProblemPath: Dispatch<SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProblemView({problem, setProblemPath}: Props) {
  const [db, setDb] = useState<PGlite | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    !db && void loadDb(setDb);
  }, [db]);

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
    setIsSolved(false);

    if (!problem.steps) {
      // We've likely hit a terminal point - do nothing.
    }
    else if (stepIndex < problem.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setStepIndex(0);
      setProblemPath(problem.navigation.next)
    }
  }

  const currentStep = problem.steps ? problem.steps[stepIndex] : null;

  return <>
    { DEBUG &&
        <div>
            <button onClick={onNextClicked}>debug: Next</button>
        </div>
    }
    <h2>{problem.title}</h2>
    <div>
      {isSolved && currentStep
        ? <div><h3>Solved!</h3><ReactMarkdown children={currentStep.outcome}/></div>
        : currentStep && <h3>Not Solved</h3>
      }
      <button disabled={!isSolved} onClick={onNextClicked}>Next</button>
    </div>
    { currentStep ? <ReactMarkdown children={currentStep.blurb}/> : "Uhh, here's a REPL." }
    {
      db
        ? currentStep
          ? <SQLView db={db} setIsSolved={setIsSolved} expectedRows={currentStep.expectedRows}/>
          : <Repl pg={db} />
        : <div>Loading...</div>
    }
  </>
}

