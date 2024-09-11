import './App.css'
import {ProblemView} from "./ProblemView.tsx";
import {useEffect, useState} from "react";

import {problemIndex} from "./problem-index.ts";
import {Problem} from "./problem.ts";

function App() {
  const [problemPath, setProblemPath] = useState(problemIndex.first);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    async function loadProblem(path: string) {
      const response = await fetch(`problems/${path}`);
      setProblem(await response.json() as Problem);
    }

    void loadProblem(problemPath)
  }, [problemPath]);
  return (
    <>
      <div style={{width: "100%", height: "800px"}}>
        {
          problem
          ? <ProblemView setProblemPath={setProblemPath} problem={problem} />
          : <div>No problem... loaded.</div>
        }

      </div>
    </>
  )
}

export default App
