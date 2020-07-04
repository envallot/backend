import express, { Request, Response, NextFunction, Application } from 'express'
import { ErrorWithStatus } from './types'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

const corsOptions = {
  origin: ['http://localhost:3000', 'https://master.d3jy9j46ta2dag.amplifyapp.com'],
  credentials: true,
  maxAge: 3600
}

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
  server.use(cookieParser())
  server.use(cors(corsOptions))
  server.use(helmet())
  server.use(express.json())
  server.use(handleErrors)
}