import { PGlite, Results } from "@electric-sql/pglite";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DEBUG, PROBLEM_SCHEMA } from "../config.ts"; // Optional Theme applied to the Data Grid
import "../styles/SQLConsole.css";
import {QueryInput} from "./molecule/QueryInput.tsx";
import {QueryResult} from "../types/query-result.ts";
import {QueryResultView} from "./molecule/QueryResults.tsx";

interface Props {
  db: PGlite
  setIsSolutionSubmitted: Dispatch<SetStateAction<boolean>>
  expectedRows: string
}

export function SQLConsole({ db, setIsSolutionSubmitted, expectedRows }: Props) {
  const [queryResult, setQueryQueryResult] = useState<QueryResult | null>(null);
  const [query, setQuery] = useState<string | null>(null);

  // Execute the query
  useEffect(() => {
    async function waitDbReadyAndExecute(query: string) {
      await db.waitReady;
      try {
        const rawResult = await executeQuery(db, query);
        if (rawResult) {
          const rows = resultToRows(rawResult);
          const columnNames = rawResult.fields.map(field => field.name);
          const actualRows = rowsToCSV(rows);
          const isCorrect = actualRows.trim() === expectedRows.trim();

          setQueryQueryResult({
            status: isCorrect ? "correct" : "incorrect",
            rows, columnNames
          });

          // for printing answers
          if (DEBUG) {
            console.log(actualRows);
            console.log(expectedRows);
          }
        } else {
          setQueryQueryResult({status: "error", error: "Unknown error: No result from query." });
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setQueryQueryResult({status: "error", error: err.toString() });
        } else {
          setQueryQueryResult({status: "error", error: "Unknown error." });
        }
      }
    }

    query && waitDbReadyAndExecute(query);
  }, [db, query, expectedRows]);

  // Reset on new problem.
  useEffect(() => {
    setQueryQueryResult(null);
  }, [expectedRows]);

  function canSendResult() {
    return queryResult && queryResult.status === "correct";
  }

  return (
    <div className={"sql-console"}>
      { renderResult(queryResult) }
      <QueryInput setQuery={setQuery} />
      { canSendResult() && <button onClick={() => setIsSolutionSubmitted(true)}>Send Results</button> }
    </div>
  );
}

function renderResult(queryResult: QueryResult | null) {
  if (!queryResult) {
    return <></>
  }
  switch(queryResult.status) {
    case "error":
      return <p></p>
    case "correct":
    case "incorrect":
      return <QueryResultView queryResult={queryResult}/>
  }
}

async function executeQuery(db: PGlite , query: string) {
    return await db.transaction(async (tx) => {
      await tx.exec(`SET search_path TO ${PROBLEM_SCHEMA}`);
      return await tx.query<Record<string, string>>(query);
    });
}

function resultToRows(result: Results<Record<string, string>>): string[][] {
  const { fields, rows } = result;
  return rows.map((row) => fields.map((field) => row[field.name]));
}

function rowsToCSV(rows: string[][]) {
  return rows.map((row) => row.join(",")).join("\n");
}