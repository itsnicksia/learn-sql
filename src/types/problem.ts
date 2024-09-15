export interface Problem {
  setupQuery: string;
  title: string;
  steps?: ProblemStep[];
  navigation: Navigation;
}

export interface ProblemStep {
  messages: string[];
  expectedRows: string;
  success: string;
}

interface Navigation {
  next: string;
}
