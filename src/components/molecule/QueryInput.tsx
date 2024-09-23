import CodeEditor from "@uiw/react-textarea-code-editor";
import {Dispatch, SetStateAction} from "react";
interface Props {
  setQuery: Dispatch<SetStateAction<string | null>>
}

let queryBuffer = "";

export function QueryInput({setQuery}: Props) {

  return <div className={"sql-console-query-input flex-fill"}>
    <CodeEditor
      language="sql"
      placeholder="It's SQL Time!"
      onChange={(evn) => (queryBuffer = evn.target.value)}
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
    <button className={"fixed-width"} onClick={() => setQuery(queryBuffer)}>Execute Query</button>
  </div>
}