export class PaginationResponse<T> {
  constructor(public count: number, public items: T[]) {}
}
