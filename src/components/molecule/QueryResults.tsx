import {QueryResultData} from "../../types/query-result.ts";

interface Props {
  queryResult: QueryResultData
}

export function QueryResultView({queryResult}: Props) {
  return <div>
    <table>
      { queryResult.columnNames.map((columnName, index) => <th key={index}>{columnName}</th>) }
      <tbody>
      { queryResult.rows.map((row, rowIndex) =>
        <tr key={rowIndex}>
          {row.map((value, columnIndex) => <td key={columnIndex}>{value}</td>) }
        </tr>
      )}
      </tbody>
    </table>
  </div>
}