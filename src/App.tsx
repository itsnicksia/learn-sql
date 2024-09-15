import "./styles/App.css";
import { ProblemView } from "./components/ProblemView.tsx";
import { useEffect, useState } from "react";

import { problemIndex } from "./config/problem-index.ts";
import { Problem } from "./types/problem.ts";
import * as yaml from "js-yaml";
import { PGlite } from "@electric-sql/pglite";
import loadDb from "./hooks/load-database.ts";

function App() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [problemPath, setProblemPath] = useState(problemIndex.first);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    !db && void loadDb(setDb);
  }, [db]);

  useEffect(() => {
    async function loadProblem(path: string) {
      const response = await fetch(`problems/${path}`);
      const body = await response.text();
      setProblem(yaml.load(body) as Problem);
    }

    void loadProblem(problemPath);
  }, [problemPath]);
  return (
    <>
      {db ? problem && <ProblemView setProblemPath={setProblemPath} problem={problem} db={db} /> : "Loading..."}
    </>
  );
}

export default App;
