import express, { Router } from 'express'
// import routes from './routes'
import { applyMiddleware } from './utils/middlewares'
import { userRoutes } from './libs/Users/routes'


const port: number | string = process.env.PORT || 8000

const app = express()

applyMiddleware(app)

const routes = Router()

routes.use('user', userRoutes)

app.use('/', routes)

app.listen(port, () => console.log(`Server has started on port ${port}`))