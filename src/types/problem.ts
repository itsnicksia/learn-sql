import { MessageType } from "./chat-message.ts";

export interface Problem {
  setupQuery: string;
  title: string;
  steps?: ProblemStep[];
  navigation: Navigation;
}

export interface ProblemStepMessage {
  message: string
  messageType?: MessageType
}

export interface ProblemStep {
  messages: ProblemStepMessage[];
  expectedRows: string;
  success: string;
}

interface Navigation {
  next: string;
}
