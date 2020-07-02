import express, { Request, Response, NextFunction, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'


const handleErrors = (err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err)
  res.status(err.httpStatusCode || 500).json({
    msg: err.message,
    detail: err.detail
  });
}

export const applyMiddleware = (server: Application) => {
  server.use(cors())
  server.use(helmet())
  server.use(express.json())
  server.use(handleErrors)
}