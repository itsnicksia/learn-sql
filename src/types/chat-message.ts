export interface ChatMessage {
  type: "user" | "narrator"
  message: string
}