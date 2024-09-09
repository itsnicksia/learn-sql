import {PGlite, Row} from "@electric-sql/pglite";
import {useEffect, useState} from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import {AgGridReact} from 'ag-grid-react'; // React Data Grid Component
import {ColDef} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

export function SQLConsole() {
  let queryBuffer = "";
  const [query, setQuery] = useState<string>("");
  const [db] = useState(new PGlite("idb://sql-learnprogramming-io"));
  const [rowData, setRowData] = useState<unknown[]>([]);
  const [rows, setRows] = useState<Row<unknown>[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [colDefs, setColDefs] = useState<ColDef<unknown>[]>([]);

  // Execute the query
  useEffect(() => {
    async function executeQuery() {
      const result = await db.query<string>(query);
      setRowData(result.rows);
      setRows(result.rows);
      setColDefs(result.fields.map(field => ({"field": field.name} as ColDef)));
      console.log(result);
    }

      executeQuery().catch(err => {
        if (err instanceof Error) {
          console.log(err);
        }
      });
  }, [db, query]);

  // Check the result
  useEffect(() => {
    // FIXME: Hackerman!
    // @ts-expect-error I'm lazy and a bad dev
    setIsSolved(rows.length > 0 && rows[0]["?column?"] == "1");
  }, [rows])


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
      <button onClick={() => { if (queryBuffer != "") { setQuery(queryBuffer) } } } >Execute!</button>
      <h3>{ isSolved ? "Solved!" : "Not Solved"}</h3>
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