export interface Problem {
  setupQuery: string;
  title: string;
  steps?: ProblemStep[];
  navigation: Navigation;
}

interface ProblemStep {
  blurb: string;
  expectedRows: string;
  outcome: string;
}

interface Navigation {
  next: string;
}
