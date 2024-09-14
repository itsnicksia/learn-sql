import { PGlite, Results } from "@electric-sql/pglite";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { DEBUG, PROBLEM_SCHEMA } from "../config.ts"; // Optional Theme applied to the Data Grid

interface Props {
  db: PGlite;
  setIsSolved: Dispatch<SetStateAction<boolean>>;
  expectedRows: string;
}

let queryBuffer = "";

export function SQLView({ db, setIsSolved, expectedRows }: Props) {
  const [query, setQuery] = useState<string | null>(null);

  const [rowData, setRowData] = useState<unknown[]>([]);
  const [colDefs, setColDefs] = useState<ColDef<unknown>[]>([]);

  const [result, setResult] = useState<Results<Record<string, string>> | null>();

  // Execute the query
  useEffect(() => {
    async function executeQuery(query: string) {
      return await db.transaction(async (tx) => {
        await tx.exec(`SET search_path TO ${PROBLEM_SCHEMA}`);
        return await tx.query<Record<string, string>>(query);
      });
    }

    query &&
      executeQuery(query)
        .then((result) => {
          if (result) {
            setRowData(result.rows);
            setResult(result);
            setColDefs(result.fields.map((field) => ({ field: field.name }) as ColDef));
          }
        })
        .catch((err) => {
          console.log(err);
        });
  }, [db, query]);

  // Check the result
  useEffect(() => {
    if (result) {
      const actualRows = toCSV(resultToRows(result));
      setIsSolved(actualRows.trim() === expectedRows.trim());

      // for printing answers
      if (DEBUG) {
        console.log(actualRows);
        console.log(expectedRows);
      }
    }
  }, [result, expectedRows]);

  // Reset on new problem.
  useEffect(() => {
    queryBuffer = "";
    setQuery(null);
    setRowData([]);
    setColDefs([]);
    setResult(null);
  }, [expectedRows]);

  return (
    <div style={{ width: "100%" }}>
      <CodeEditor
        value={query ?? ""}
        language="sql"
        placeholder="It's SQL Time!"
        onChange={(evn) => (queryBuffer = evn.target.value)}
        padding={15}
        minHeight={16}
        style={{
          backgroundColor: "#202020",
          fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      />
      <button onClick={() => setQuery(queryBuffer)}>Execute!</button>

      <div
        className="ag-theme-quartz-auto-dark" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >
        <AgGridReact rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
}

function resultToRows(result: Results<Record<string, string>>): string[][] {
  const { fields, rows } = result;
  return rows.map((row) => fields.map((field) => row[field.name]));
}

function toCSV(rows: string[][]) {
  return rows.map((row) => row.join(",")).join("\n");
}
