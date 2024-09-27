import { PGlite, Results } from "@electric-sql/pglite";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DEBUG, PROBLEM_SCHEMA } from "../../config.ts"; // Optional Theme applied to the Data Grid
import "./SQLConsole.css";
import {QueryInput} from "../molecule/QueryInput.tsx";
import {QueryResult} from "../../types/query-result.ts";
import {QueryResultView} from "../molecule/QueryResults.tsx";

interface Props {
  db: PGlite
  setIsSolutionSubmitted: Dispatch<SetStateAction<boolean>>
  expectedRows: string | undefined
}

let queryBuffer = "";

export function SQLConsole({ db, setIsSolutionSubmitted, expectedRows }: Props) {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [query, setQuery] = useState<string>();

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
          const isCorrect = !expectedRows || actualRows.trim() === expectedRows.trim();

          setQueryResult({
            status: isCorrect ? "correct" : "incorrect",
            rows, columnNames
          });

          // for printing answers
          if (DEBUG) {
            console.log(actualRows);
            console.log(expectedRows);
          }
        } else {
          setQueryResult({status: "error", error: "Unknown error: No result from query." });
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setQueryResult({status: "error", error: err.toString() });
        } else {
          setQueryResult({status: "error", error: "Unknown error." });
        }
      }
    }

    query && waitDbReadyAndExecute(query);
  }, [db, query, expectedRows]);

  function canSendResult() {
    return queryResult && queryResult.status === "correct";
  }

  function renderResult(queryResult: QueryResult | null) {
    if (!queryResult) {
      return <></>
    }
    switch (queryResult.status) {
      case "error":
        return <></>
      case "correct":
      case "incorrect":
        return <>
          <QueryResultView queryResult={queryResult} />
          <button className={"send-result"} disabled={!canSendResult()} onClick={() => setIsSolutionSubmitted(true)}>Send Result</button>
        </>;
    }
  }

  return (
    <div className={"sql-console"}>
      <div className={"sql-console-result-view"}>
        { renderResult(queryResult) }
      </div>
      <div className={"sql-console-query-input"}>
        <QueryInput setQueryBuffer={(value) => queryBuffer = value} />
        <button className={"execute-query"} onClick={() => setQuery(queryBuffer)}>Execute Query</button>
      </div>
    </div>
  );
}


async function executeQuery(db: PGlite, query: string) {
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