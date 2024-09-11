import {SQLView} from "./SQLView.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PGlite} from "@electric-sql/pglite";
import {Problem} from "./problem.ts";

interface Props {
  problem: Problem,
  setProblemPath?: Dispatch<SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProblemView({problem, setProblemPath}: Props) {
  const [db, setDb] = useState(new PGlite());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDb(new PGlite());
  }, [problem])

  useEffect(() => {
    async function waitReady() {
      await db.waitReady;
      setReady(true);
    }
    void waitReady();
  }, [db]);

  return <>
    <h1>{problem.title}</h1>
    <h2>{problem.blurb}</h2>
    {
      ready
        ? <SQLView db={db} expectedRows={problem.expected}/>
        : <div>Loading...</div>
    }
  </>
}