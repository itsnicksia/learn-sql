interface Props {
  onNextClicked: () => void;
}

export function DebugToolbar({ onNextClicked }: Props) {
  return (
    <div>
      <button onClick={onNextClicked}>debug: Next</button>
    </div>
  );
}
