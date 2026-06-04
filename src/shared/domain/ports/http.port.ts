export interface HttpRequestConfig<
  Params = Record<string, string | undefined>,
> {
  /** Parámetros de consulta (query params) */
  params?: Params;
  /** Encabezados adicionales */
  headers?: Record<string, string>;
}

export abstract class HttpPort {
  abstract post<T>(
    url: string,
    body: any,
    config?: HttpRequestConfig,
  ): Promise<T>;
  abstract patch<T>(
    url: string,
    body: any,
    config?: HttpRequestConfig,
  ): Promise<T>;
  abstract get<T, Params = Record<string, string | undefined>>(
    url: string,
    config?: HttpRequestConfig<Params>,
  ): Promise<T>;
}
