import {SQLView} from "./SQLView.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PGlite} from "@electric-sql/pglite";
import {Problem} from "../types/problem.ts";
import ReactMarkdown from "react-markdown";
import loadDb from "../hooks/load-database.ts";
import {PROBLEM_SCHEMA} from "../config.ts";

interface Props {
  problem: Problem,
  setProblemPath: Dispatch<SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProblemView({problem, setProblemPath}: Props) {
  const [db, setDb] = useState<PGlite | null>(null);
  const [isSolved, setIsSolved] = useState(false);

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

    setIsSolved(false);
    db && void setup(db, problem);
  }, [db, problem]);

  return <>
    <h2>{problem.title}</h2>
    <div>
      {isSolved
          ? <h3>Solved!</h3>
          : <h3>Not Solved</h3>
      }
      <button disabled={!isSolved} onClick={() => setProblemPath(problem.navigation.next)}>Next</button>
    </div>
    <ReactMarkdown children={problem.blurb}/>
    {
      db
          ? <SQLView db={db} setIsSolved={setIsSolved} expectedRows={problem.expectedRows}/>
          : <div>Loading...</div>
    }
  </>
}