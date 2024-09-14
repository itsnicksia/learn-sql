import {PGlite, Results} from "@electric-sql/pglite";
import {useEffect, useState} from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import {AgGridReact} from 'ag-grid-react'; // React Data Grid Component
import {ColDef} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

interface Props {
  db: PGlite,
  expectedRows: string[][],
}

export function SQLView({db, expectedRows}: Props) {
  let queryBuffer = "";
  const [query, setQuery] = useState<string>("");

  const [rowData, setRowData] = useState<unknown[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<unknown>[]>([]);

  const [result, setResult] = useState<Results<Record<string, string>>>();
  const [isSolved, setIsSolved] = useState(false);

  // Execute the query
  useEffect(() => {
    async function executeQuery() {
      const result = await db.query<Record<string, string>>(query);
      setRowData(result.rows);
      setResult(result);
      setColDefs(result.fields.map(field => ({"field": field.name} as ColDef)));
      console.log(result);
    }

    executeQuery().catch(err => {
      if (err instanceof Error) {
        // TODO: Display errors properly
        console.log(err);
      }
    });
  }, [db, query]);

  // Check the result
  useEffect(() => {
    if (result) {
      const actualRows = resultToRows(result);

      setIsSolved(isResultCorrect(actualRows, expectedRows));
    }
  }, [result, expectedRows])


  return (
    <div style={{width: "100%"}}>
      <CodeEditor
        value={query}
        language="sql"
        placeholder="It's SQL Time!"
        onChange={(evn) => queryBuffer = evn.target.value}
        padding={15}
        minHeight={16}
        style={{
          backgroundColor: "#202020",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          height: "200px",
        }}
      />
      <button onClick={() => {
        if (queryBuffer != "") {
          setQuery(queryBuffer)
        }
      }}>Execute!
      </button>
      <h3>{isSolved ? "Solved!" : "Not Solved"}</h3>
      <div
        className="ag-theme-quartz-auto-dark" // applying the Data Grid theme
        style={{height: 500}} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
        />
      </div>
    </div>
  );
}

function resultToRows(result: Results<Record<string, string>>): string[][] {
  const {fields, rows} = result
  return rows.map(row =>
    fields.map((field) => row[field.name])
  );
}

function isResultCorrect(actualRows: string[][], expectedRows: string[][]): boolean {
  if (actualRows.length !== expectedRows.length) {
    return false;
  }

  for (let rowIndex = 0; rowIndex < actualRows.length; rowIndex++) {
    const actualRow = actualRows[rowIndex];
    const expectedRow = expectedRows[rowIndex];

    if (actualRow.length !== expectedRow.length) {
      return false;
    }

    for (let columnIndex = 0; columnIndex < actualRow.length; columnIndex++) {
      if (actualRow[columnIndex].toString() !== expectedRow[columnIndex]) {
        return false;
      }
    }
  }

  return true;
}