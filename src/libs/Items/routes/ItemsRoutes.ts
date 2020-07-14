import { ItemsServices } from "../services/ItemsServices";
import { Routes, RequestWithID, HTTPError } from "../../utils";
import { Request, Response, NextFunction } from "express";

export class ItemsRoutes extends Routes {
  service: ItemsServices
  constructor(itemsServices: ItemsServices) {
    super("/items")
    this.service = itemsServices
    this.initRoutes()
  }

  initRoutes() {
    this.router.post(
      "/", 
      this.authRequired,
      this.validateItemBody,
      async (req: any, res: Response, next: NextFunction) => {
      try {
        const item = await this.service.create(req.userID, req.body.name, req.body.amount)
        res.json(item)
      } catch (error) {
        console.log('create item error', error)
        next(error)
      }
    })
  }

  validateItemBody(req: RequestWithID, res: Response, next: NextFunction) {
    if(!req.body.name || !req.body.amount) {    
      const error = new HTTPError("Please include both name and amount in dollars", 422, new Error("Invalid input"))
      next(error) 
    } else {
      next()
    }
  }

  authRequired(req: RequestWithID, res: Response, next: NextFunction) {
    if(!req.cookies || !req.cookies.id) {
      const error = new HTTPError("Please create an account", 401, new Error("Unauthorized request"))
      next(error)
    } else {
      req.userID = req.cookies.id
      next()
    }
  }
}