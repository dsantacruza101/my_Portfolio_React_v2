# Checkpoints

A running log of notable milestones in this project, most recent first.

---

## 2026-07-22 — Chat service converted from Promise to cancellation-aware RxJS Observable

**Why:** The portfolio's AI chat widget is expected to keep growing (streaming replies,
richer conversational UX), so RxJS was adopted as the reactive foundation now rather than
retrofitted later. Unsubscribing needed to genuinely cancel the in-flight fetch (e.g. closing
the widget mid-request), so `HttpClient` was rebuilt around `rxjs/fetch`'s `fromFetch` +
`AbortController` instead of a thin Promise-wrapping shim.

**What changed:**
- `src/services/http.client.ts` — `request$`/`get$`/`post$` are now the core implementation
  (built on `fromFetch`); `request`/`get`/`post` became thin `firstValueFrom` adapters over
  them, so `ContactService` and its Promise-based callers are unaffected.
- `src/types/chat.ts` — `IChatService.sendMessage` returns `Observable<ChatResponse>`.
- `src/services/chat.service.ts` — delegates to `chatHttpClient.post$`.
- `src/hooks/useChatWidget.ts` — subscribes via `.pipe(finalize(...)).subscribe({ next, error })`
  and unsubscribes on unmount, which aborts a pending request if the widget closes mid-response.
- Test suites updated across `http.client.test.ts` (added `get$`/`post$` + cancellation
  coverage), `chat.service.test.ts`, and `useChatWidget.test.tsx`.
- Added `rxjs` (`^7.8.2`) as a dependency.

**Status:** 104/104 tests passing, `tsc --noEmit` clean, lint clean. Not yet verified: manual
smoke test in the browser (send a message; close the widget mid-request and confirm via the
Network tab that the request is actually cancelled).
