export interface Problem {
  setupQuery: string,
  title: string
  blurb: string
  navigation: Navigation
  expectedRows: string
}

interface Navigation {
  next: string
}