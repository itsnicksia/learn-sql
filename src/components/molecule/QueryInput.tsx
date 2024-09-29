import CodeEditor from "@uiw/react-textarea-code-editor";
import "./QueryInput.css";
interface Props {
  setQueryBuffer: (value: string) => void
}

export function QueryInput({setQueryBuffer}: Props) {

  return <div className={"query-input"}>
    <CodeEditor
      language="sql"
      placeholder="Type your SQL database command here!"
      onChange={(evn) => (setQueryBuffer(evn.target.value))}
      padding={5}
      minHeight={6}
      className={"code-editor"}
      style={{
        backgroundColor: 'var(--md3-secondary)',
        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        overflowY: 'auto'
      }}
    />
  </div>
}