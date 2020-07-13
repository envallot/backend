
/**
 * HTTPError has a place for a status code and user friendly errorMessage
 */
export class HTTPError extends Error {
  httpStatusCode: number
  errorMessage: string
  constructor(msg: string, status: number, error: Error) {
    super(error.message)
    // this.stack = error.stack
    // this.name = error.name
    this.errorMessage = msg
    this.httpStatusCode = status
  }
}

/**
 * Model is what our domain specific models inherit from
 */
export class Model {
  db: any
  query: any
  _internalErrorMsg: string
  constructor(database: any) {
    this.db = database
    this.query = this.db.client.query
    this._internalErrorMsg = "There was an error that wasn't your fault"
  }
}