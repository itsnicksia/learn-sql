export interface RawProblem {
  migrations: string[],
  title: string
  blurb: string
  expectedCsv: string
}

export interface Problem {
  migrations: string[],
  title: string
  blurb: string
  expectedRows: string[][]
}