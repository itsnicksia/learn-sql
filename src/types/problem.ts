export interface RawProblem {
  migrations: string[]
  title: string
  blurb: string
  navigation: Navigation
  expectedCsv: string
}

export interface Problem {
  migrations: string[],
  title: string
  blurb: string
  navigation: Navigation
  expectedRows: string[][]
}

interface Navigation {
  next: string
}