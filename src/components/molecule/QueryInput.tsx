import CodeEditor from "@uiw/react-textarea-code-editor";
interface Props {
  setQueryBuffer: (value: string) => void
}

export function QueryInput({setQueryBuffer}: Props) {

  return <div className={"sql-console-query-input flex-fill"}>
    <CodeEditor
      language="sql"
      placeholder="Type your SQL database command here!"
      onChange={(evn) => (setQueryBuffer(evn.target.value))}
      padding={15}
      minHeight={16}
      className={"code-editor"}
      style={{
        backgroundColor: '#49454F',
        fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: '1rem',
        fontWeight: 'bold',
        flexGrow: 1
      }}
    />
  </div>
}