import { SQLView } from "./SQLView.tsx";
import { useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import { ProblemStep } from "../types/problem.ts";
import ReactMarkdown from "react-markdown";
import { ProblemStepStatus } from "./molecule/ProblemStepStatus.tsx";

interface Props {
  db: PGlite;
  currentStep: ProblemStep;
  onNextClicked: () => void;
}

export function ProblemStepView({ db, currentStep, onNextClicked }: Props) {
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    setIsSolved(false);
  }, [currentStep]);

  return (
    <>
      <ProblemStepStatus isSolved={isSolved} solvedText={currentStep.outcome} onNextClicked={onNextClicked} />
      <div style={ { width: "600px", textAlign: "left", margin: "auto", backgroundColor: "#202020", padding: "10px" } }>
        <ReactMarkdown children={currentStep.blurb} />
      </div>
      <SQLView db={db} setIsSolved={setIsSolved} expectedRows={currentStep.expectedRows} />
    </>
  );
}
