import "./App.css";
import { ProblemView } from "./components/pages/ProblemView.tsx";
import { useEffect, useState } from "react";

import { problemIndex } from "./config/problem-index.ts";
import { Problem } from "./types/problem.ts";
import * as yaml from "js-yaml";
import { PGlite } from "@electric-sql/pglite";

function App() {
  const [db] = useState<PGlite>(new PGlite());
  const [problemPath, setProblemPath] = useState(problemIndex.first);
  const [problem, setProblem] = useState<Problem | null>(null);

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
      { problem && <ProblemView setProblemPath={setProblemPath} problem={problem} db={db} /> }
    </>
  );
}

export default App;
