export interface Problem {
  migrations: string[],
  title: string
  blurb: string
  expected: string[][]
}