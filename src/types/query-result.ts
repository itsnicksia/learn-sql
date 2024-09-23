export type QueryResult =
      { status: "correct" }   & QueryResultData
  |   { status: "incorrect" } & QueryResultData
  |   { status: "error", error: string }

export interface QueryResultData {
  columnNames: string[]
  rows: string[][]
}