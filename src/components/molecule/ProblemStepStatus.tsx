import ReactMarkdown from "react-markdown";

interface Props {
  isSolved: boolean;
  solvedText: string;
  onNextClicked: () => void;
}

export function ProblemStepStatus({ isSolved, solvedText, onNextClicked }: Props) {
  return (
    <div>
      {isSolved && <ReactMarkdown children={solvedText} />}
      <button disabled={!isSolved} onClick={onNextClicked}>
        {isSolved ? "Next Problem..." : "Unsolved..."}
      </button>
    </div>
  );
}
