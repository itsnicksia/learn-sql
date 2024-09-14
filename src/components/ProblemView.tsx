import {SQLView} from "./SQLView.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PGlite} from "@electric-sql/pglite";
import {Problem} from "../types/problem.ts";
import ReactMarkdown from "react-markdown";

interface Props {
  problem: Problem,
  setProblemPath: Dispatch<SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProblemView({problem, setProblemPath}: Props) {
  const [db, setDb] = useState<PGlite | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    async function loadDb() {
      const db = new PGlite();
      await db.waitReady;
      setDb(db);
      console.log("Database loaded!")
    }
    if (!db) {
      void loadDb();
    }
  }, [db]);

  useEffect(() => {
    setIsSolved(false);
  }, [problem]);

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