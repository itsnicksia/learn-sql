import {SQLView} from "./SQLView.tsx";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PGlite} from "@electric-sql/pglite";
import {Problem} from "../types/problem.ts";
import ReactMarkdown from "react-markdown";

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

  console.log(problem.blurb);

  return <>
    <h1>{problem.title}</h1>
    <ReactMarkdown children={problem.blurb}/>
    {
      ready
        ? <SQLView db={db} expectedRows={problem.expectedRows}/>
        : <div>Loading...</div>
    }
  </>
}