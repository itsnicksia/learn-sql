interface Props {
  onNextClicked: () => void;
}

export function DebugToolbar({ onNextClicked }: Props) {
  return (
    <div style={{position: "absolute", bottom: "0px", backgroundColor: "#000", width: "100%", textAlign: "left"}} >
      <button onClick={onNextClicked}>debug: Next</button>
    </div>
  );
}
