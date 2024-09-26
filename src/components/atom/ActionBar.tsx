import "../../styles/ActionBar.css"

interface Button {
  text: string
  onClick: () => void
}

interface Props {
  buttons: Button[]
}

export function ActionBar({ buttons }: Props) {
  return <div className="actionbar-container">
    { buttons.map(button =>
      <div className="button-container">
        <button className="round-button" onClick={button.onClick}>
          WIP
        </button>
        <span className="button-label">{button.text}</span>
      </div>
    )}

  </div>
}