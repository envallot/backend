import { UsersServices } from '../services/UsersServices'
import { Router, Request, Response, NextFunction } from 'express'

interface RequestWithID extends Request {
  userID?:string
}

export class UsersRoutes {
  router: Router
  path: string
  usersServices: UsersServices

  constructor(usersServices: UsersServices) {
    this.router = Router()
    this.initLogger()
    this.path = "/users"
    this.usersServices = usersServices
    this.initRoutes()
  }

  initRoutes() {
    this.router.post('/', this.checkCookieAndCreateUser, async (req: RequestWithID, res: Response, next: NextFunction) => {
      try {
        res.cookie('id', req.userID, { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.json({
          success: true,
          id: req.userID
        })
        res.end()
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

  /** checkCookieAndCreateUser checks if a request has a cookie, if so it takes the id from it and places
   * on the request object as userID to be used by future mw. If no id is undefined, so no cookie or no id
   * it creates a new user, and sends a cookie with that new user's id as id. This is our automatic registration
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  checkCookieAndCreateUser = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const { id } = req.cookies
      if (id) {
        req.userID = id

      } else {
        const id = await this.usersServices.create()

        req.userID = id.toString()
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}