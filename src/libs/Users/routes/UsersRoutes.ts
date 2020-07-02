import { UsersServices } from '../services/UsersServices'
import { Router, Request, Response, NextFunction } from 'express'

export class UsersRoutes {
  router: Router
  path: string
  usersServices: UsersServices

  constructor(usersServices: UsersServices) {
    console.log('usersRoutes invoked')
    this.router = Router()
    this.initLogger()
    this.path = "/users"
    this.usersServices = usersServices
    this.initRoutes()
  }

  initRoutes() {
    this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const newUser = await this.usersServices.create()
        console.log('new user in routes:', newUser)
        res.json({
          success: true,
          id: newUser.id
        })
      } catch (e) {
        next(e)
      }
    })
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