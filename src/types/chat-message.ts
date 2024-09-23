export interface ChatMessage {
  participantType: "user" | "mentor" | "submittedResult" | "tip" | "summary"
  message?: string
}