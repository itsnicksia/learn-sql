export type MessageType = "user" | "mentor" | "submittedResult" | "tip" | "summary" | "important"

export interface ChatMessage {
  messageType: MessageType
  message?: string
}