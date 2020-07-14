import { Router, Request, Response, NextFunction } from 'express'

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

/**
 * Routes provides request logging for each specific route
 */
export class Routes {
  path: string
  router: Router

  constructor(path:string) {
    this.path = path
    this.router = Router()
    this.initLogger()
  }

  initLogger() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      console.log('request received', {
        time: Date.now(),
        path: this.path,
        method: req.method,
        body: req.body,
        params: req.params,
      })
      next()
    })
  }
}