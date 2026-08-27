import type { Observable } from 'rxjs';

/** Payload sent to the RAG chat backend's `/chat` endpoint. */
export interface ChatRequestPayload {
  message: string;
}

/** Response returned by the RAG chat backend. */
export interface ChatResponse {
  answer: string;
}

/** Abstraction over the chat API, allowing the hook to be tested against a mock. */
export interface IChatService {
  sendMessage(payload: ChatRequestPayload): Observable<ChatResponse>;
}

/** A single turn in the chat conversation, used for UI rendering. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
