type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

interface RequestContext {
  url: string;
  options: RequestOptions;
}

type RequestInterceptor = (ctx: RequestContext) => RequestContext;

class HttpClient {
  private readonly baseUrl: string;
  private readonly requestInterceptors: RequestInterceptor[] = [];

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    this.registerDefaultInterceptors();
  }

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

  get<T = void>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T = void>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }
}

export const httpClient = new HttpClient();
