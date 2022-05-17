import type { Request, Response } from 'express'
import type { Query, Send, Params } from 'express-serve-static-core'

// https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c

interface TypedRequest<
  QueryType extends Query,
  ParamsType extends Params,
  BodyType
> extends Request {
  body: BodyType
  query: QueryType
  params: ParamsType
}

interface TypedResponse<T> extends Response {
  json: Send<T, this>
  send: Send<T, this>
}
