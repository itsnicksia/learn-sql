import {PGlite} from "@electric-sql/pglite";
import {useEffect, useState} from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid


// -> { rows: [ { message: "Hello world" } ] }

export function SQLConsole() {
    const [queryBuffer, setQueryBuffer] = useState<string>("");
    const [query, setQuery] = useState<string>("");
    const [db] = useState(new PGlite());
    const [rowData, setRowData] = useState<unknown[]>([]);
    const [colDefs, setColDefs] = useState<ColDef<unknown>[]>([]);

    useEffect(() => {
        async function executeQuery() {
          const result = await db.query(query);
          setRowData(result.rows);
          setColDefs(result.fields.map(field => ({ "field": field.name } as ColDef)));
        }

        void executeQuery();
    }, [db, query]);


  return (
      <>
          <CodeEditor
              value={query}
              language="sql"
              placeholder="It's SQL Time!"
              onChange={(evn) => setQueryBuffer(evn.target.value) }
              padding={15}
              style={{
                  backgroundColor: "#202020",
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              }}
          />
          <button onClick={() => setQuery(queryBuffer) }>Execute!</button>
          <div
              className="ag-theme-quartz-auto-dark" // applying the Data Grid theme
              style={{height: 500}} // the Data Grid will fill the size of the parent container
          >
              <AgGridReact
                  rowData={rowData}
                  columnDefs={colDefs}
              />
          </div>
      </>
  );
    }