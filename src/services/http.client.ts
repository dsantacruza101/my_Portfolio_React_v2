type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

interface RequestContext {
  url: string;
  options: RequestOptions;
}

/** A function that receives and transforms a request context before it is fetched. */
type RequestInterceptor = (ctx: RequestContext) => RequestContext;

export class HttpClient {
  private readonly baseUrl: string;
  private readonly requestInterceptors: RequestInterceptor[] = [];

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    this.registerDefaultInterceptors();
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
   * Executes an HTTP request after running all registered interceptors.
   * Automatically sets `Content-Type: application/json` and serializes the body.
   * Throws on non-2xx responses, using the server's `message` field when available.
   * @param path - Path relative to the base URL (e.g. `/portfolio/contact-me`).
   * @param options - Fetch options; `body` is serialized to JSON automatically.
   */
  async request<T = void>(path: string, options: RequestOptions = {}): Promise<T> {
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

    const response = await fetch(`${this.baseUrl}${ctx.url}`, ctx.options as RequestInit);

    if (!response.ok) {
      const error = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(error?.message ?? `Request failed with status ${response.status}`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  /**
   * Sends a GET request to the given path.
   * @param path - Path relative to the base URL.
   */
  get<T = void>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Sends a POST request with an optional JSON body.
   * @param path - Path relative to the base URL.
   * @param body - Value to serialize as the request body.
   */
  post<T = void>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }
}

export const httpClient = new HttpClient();
