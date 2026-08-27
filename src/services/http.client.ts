import { firstValueFrom, type Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

interface RequestContext {
  url: string;
  options: RequestOptions;
}

/** A function that receives and transforms a request context before it is fetched. */
type RequestInterceptor = (ctx: RequestContext) => RequestContext;

interface HttpClientConfig {
  /** Overrides the base URL read from `VITE_API_BASE_URL`. */
  baseUrl?: string;
  /** When `false`, skips registering the default `/api`-prefix interceptor. Defaults to `true`. */
  useApiPrefix?: boolean;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly requestInterceptors: RequestInterceptor[] = [];

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl ?? (import.meta.env.VITE_API_BASE_URL as string);
    if (config.useApiPrefix ?? true) {
      this.registerDefaultInterceptors();
    }
  }

  /**
   * Registers a request interceptor applied to every outgoing request.
   * Interceptors run in registration order and can modify the URL or options.
   * @returns The client instance for chaining.
   */
  addRequestInterceptor(interceptor: RequestInterceptor): this {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  private registerDefaultInterceptors() {
    this.addRequestInterceptor((ctx) => ({
      ...ctx,
      url: `/api${ctx.url}`,
    }));
  }

  /**
   * Parses a fetch {@link Response}, throwing on non-2xx responses using the
   * server's `message` field when available.
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(error?.message ?? `Request failed with status ${response.status}`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  /**
   * Executes an HTTP request after running all registered interceptors.
   * Automatically sets `Content-Type: application/json` and serializes the body.
   * Unsubscribing before the response resolves aborts the underlying fetch.
   * @param path - Path relative to the base URL (e.g. `/portfolio/contact-me`).
   * @param options - Fetch options; `body` is serialized to JSON automatically.
   */
  request$<T = void>(path: string, options: RequestOptions = {}): Observable<T> {
    const { body, headers, ...rest } = options;

    let ctx: RequestContext = {
      url: path,
      options: {
        ...rest,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
    };

    ctx = this.requestInterceptors.reduce((c, interceptor) => interceptor(c), ctx);

    return fromFetch(`${this.baseUrl}${ctx.url}`, {
      ...(ctx.options as RequestInit),
      selector: (response) => this.parseResponse<T>(response),
    });
  }

  /**
   * Promise-based variant of {@link request$} — resolves with the first (and only) emission.
   */
  request<T = void>(path: string, options?: RequestOptions): Promise<T> {
    return firstValueFrom(this.request$<T>(path, options));
  }

  /**
   * Sends a GET request to the given path, as an Observable.
   * @param path - Path relative to the base URL.
   */
  get$<T = void>(path: string, options?: Omit<RequestOptions, 'body'>): Observable<T> {
    return this.request$<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Sends a GET request to the given path.
   * @param path - Path relative to the base URL.
   */
  get<T = void>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return firstValueFrom(this.get$<T>(path, options));
  }

  /**
   * Sends a POST request with an optional JSON body, as an Observable.
   * @param path - Path relative to the base URL.
   * @param body - Value to serialize as the request body.
   */
  post$<T = void>(path: string, body?: unknown, options?: RequestOptions): Observable<T> {
    return this.request$<T>(path, { ...options, method: 'POST', body });
  }

  /**
   * Sends a POST request with an optional JSON body.
   * @param path - Path relative to the base URL.
   * @param body - Value to serialize as the request body.
   */
  post<T = void>(path: string, body?: unknown, options?: RequestOptions) {
    return firstValueFrom(this.post$<T>(path, body, options));
  }
}

export const httpClient = new HttpClient();
