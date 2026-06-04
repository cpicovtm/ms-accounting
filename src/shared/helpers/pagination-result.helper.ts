export interface IPaginationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IPaginationResult<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Una clase que representa el resultado de una consulta paginada.
 *
 * @template T - El tipo de registros en el resultado de la paginación.
 */
export class PaginationResult<T> {
  /**
   * El número total de registros disponibles.
   */
  total: number;

  /**
   * El número de página actual.
   */
  page: number;

  /**
   * El número total de páginas disponibles.
   */
  totalPage: number;

  /**
   * Los registros de la página actual.
   */
  records: T[];

  /**
   * Crea una instancia de PaginationResult.
   *
   * @param {IPaginationResult<T>} param0 - Los parámetros del resultado de la paginación.
   * @param {T[]} param0.records - Los registros de la página actual.
   * @param {number} param0.total - El número total de registros disponibles.
   * @param {number} param0.page - El número de página actual.
   * @param {number} param0.limit - El número de registros por página.
   */
  constructor({ records, total, page, limit }: IPaginationResult<T>) {
    this.records = records;
    this.total = +total;
    this.page = +page;
    this.totalPage = Math.ceil(+total / +limit);
  }
}
