import { Static, Type } from '@sinclair/typebox'

export class PaginationResponse<T> {
  constructor(public count: number, public items: T[]) {}
}

export const PaginationSchema = Type.Object({
  limit: Type.Integer({ maximum: 30, minimum: 1, default: 30 }),
  offset: Type.Integer({ minimum: 0, default: 0 }),
})

export type PaginationSchemaType = Static<typeof PaginationSchema>
