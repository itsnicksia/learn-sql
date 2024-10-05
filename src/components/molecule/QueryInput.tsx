import CodeEditor from "@uiw/react-textarea-code-editor";
import "./QueryInput.css";
interface Props {
  setQueryBuffer: (value: string) => void
}

export function QueryInput({setQueryBuffer}: Props) {

  return <div className={"query-input"}>
    <CodeEditor
      language="sql"
      placeholder="Press here to type your command!"
      onChange={(evn) => (setQueryBuffer(evn.target.value))}
      className={"code-editor"}
      style={{
        backgroundColor: 'var(--md3-secondary)',
        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        overflowY: 'auto',
      }}
    />
  </div>
}