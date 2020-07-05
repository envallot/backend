import express, { Request, Response, NextFunction, Application } from 'express'
import { ErrorWithStatus } from './types'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { usersRoutes } from './libs/Users/routes'

const corsOptions = {
  origin: ['http://localhost:3000', 'https://master.d3jy9j46ta2dag.amplifyapp.com'],
  credentials: true,
  maxAge: 3600
}

const handleErrors = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('express error: ', err)
  res.status(err.httpStatusCode || 500).json({
    message: err.message,
    name: err.name,
  });
}

const handle404 = (req: Request, res: Response, next: NextFunction) => {
  console.log('express 404 error')
  res.status(404).json({
    code: '404',
    name: 'Resource Unavailable',
    message:"Sorry, can't find that!"
  })
}

export const applyMiddleware = (server: Application) => {
  server.use(cookieParser())
  server.use(cors(corsOptions))
  server.use(helmet())
  server.use(express.json())
  server.use('/users', usersRoutes.router)
  server.use(handle404)
  server.use(handleErrors)
}