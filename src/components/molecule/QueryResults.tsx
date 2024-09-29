import {QueryResultData} from "../../types/query-result.ts";
import "../organisms/SQLConsole.css";

interface Props {
  queryResult: QueryResultData
}

export function QueryResultView({queryResult}: Props) {
  return <div className={"sql-console-result-table"}>
    { queryResult && <table>
      <thead>
        <tr>
          { queryResult.columnNames.map((columnName, index) => <th key={index}>{columnName}</th>) }
        </tr>
      </thead>
      <tbody>
      { queryResult.rows.map((row, rowIndex) =>
        <tr key={rowIndex}>
          {row.map((value, columnIndex) => <td key={columnIndex}>{value}</td>) }
        </tr>
      )}
      </tbody>
      </table>
    }
  </div>
}