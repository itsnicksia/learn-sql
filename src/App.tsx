import './styles/App.css'
import {ProblemView} from "./components/ProblemView.tsx";
import {useEffect, useState} from "react";

import {problemIndex} from "./config/problem-index.ts";
import {Problem, RawProblem} from "./types/problem.ts";
import * as yaml from "js-yaml";

function App() {
  const [problemPath, setProblemPath] = useState(problemIndex.first);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    async function loadProblem(path: string) {
      const response = await fetch(`problems/${path}`);
      const body = await response.text();
      const {title, blurb, migrations, navigation, expectedCsv} = yaml.load(body) as RawProblem;
      const expectedRows = expectedCsv.trim().split('\n').map(row => row.split(','));
      setProblem({
        title,
        blurb,
        migrations,
        navigation,
        expectedRows,
      });
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
