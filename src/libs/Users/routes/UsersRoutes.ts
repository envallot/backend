import { UsersServices } from '../services/UsersServices'
import { Response, NextFunction } from 'express'
import { Routes, RequestWithID } from '../../utils'


export class UsersRoutes extends Routes {
  usersServices: UsersServices

  constructor(usersServices: UsersServices) {
    super("/users")
    this.usersServices = usersServices
    this.initRoutes()
  }

  initRoutes() {
    this.router.post('/', this.checkCookieAndCreateUser, async (req: RequestWithID, res: Response, next: NextFunction) => {
      try {
        res.cookie('id', req.userID, { maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });

        const user = await this.usersServices.get(req.userID!)
        res.json({
          success: true,
          ...user
        })
        res.end()
      } catch (e) {
        next(e)
      }
    })

    this.router.put('/', this.validateUpdateBody, async (req: RequestWithID, res: Response, next: NextFunction) => {
      try {
        const user = await this.usersServices.change(req.body)
        res.status(204).json(user)
      } catch (error) {
        next(error)
      }
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

  validateUpdateBody(req: RequestWithID, res: Response, next: NextFunction) {
    if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('email')) {
      res.status(422).json({ detail: 'Something is missing' })
    } else {
      next()
    }
  }
}