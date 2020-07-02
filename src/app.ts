import express, { Router } from 'express'
// import routes from './routes'
import { applyMiddleware } from './middleware'
import { usersRoutes } from './libs/Users/routes'


export const app = express()

applyMiddleware(app)

// const routes = Router()

app.use('/users', usersRoutes.router)

