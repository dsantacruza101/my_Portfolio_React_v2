import type { Observable } from 'rxjs';
import { httpClient } from './http.client';
import type {
  IChatService,
  ChatRequestPayload,
  ChatResponse,
} from '../types';

/** Concrete implementation of {@link IChatService} that delegates HTTP calls to {@link httpClient}. */
class ChatService implements IChatService {
  /**
   * Sends a user message to the RAG chat backend and returns the generated answer.
   * Unsubscribing cancels the in-flight request.
   * @param payload - The user's message.
   */
  sendMessage(payload: ChatRequestPayload): Observable<ChatResponse> {
    return httpClient.post$<ChatResponse>('/ai/chat', payload);
  }
}

export const chatService: IChatService = new ChatService();
