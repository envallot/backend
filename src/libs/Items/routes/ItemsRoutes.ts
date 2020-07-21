import { ItemsServices } from "../services/ItemsServices";
import { Routes, RequestWithID, HTTPError } from "../../utils";
import { Response, NextFunction } from "express";

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
      this.handlePostItem
    )
    this.router.get(
      "/:envelopeID",
      this.authRequired,
      this.handleGetItemsByEnvelope
    )
    this.router.get(
      "/",
      this.authRequired,
      this.handleGetItems
    )
    this.router.put(
      "/",
      this.authRequired,
      this.validateItemBody,
      this.handlePutItem
    )
    this.router.put(
      "/assign",
      this.authRequired,
      // this.validateItemBody,
      this.handleAssignItem
    )
    this.router.delete(
      "/:itemID",
      this.authRequired,
      this.handleRemoveItem
    )
  }

  handleRemoveItem = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const itemID = await this.service.remove(req.params.itemID)
      res.json(itemID)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  handleGetItemsByEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const { envelopeID } = req.params
      const items = await this.service.getByEnvelope(req.userID!, envelopeID)
      res.json(items)
    } catch(error) {
      console.log(error)
      next(error)
    }
  }

  handlePutItem = async (req: RequestWithID, res: Response, next: NextFunction) => {
    console.log('handlePutItem invoked')

    try {

      const { id, name, amount, envelope_id } = req.body
      const item = await this.service.change(id, name, amount, envelope_id)
      
      res.json(item)

    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  handleAssignItem = async  (req: RequestWithID, res: Response, next: NextFunction) => {
    console.log('handleAssignItem invoked')
    try {
      const { id, envelope_id } = req.body

      const item = await this.service.assignItemTo(id, envelope_id)
      
      res.json(item)

    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  handleGetItems = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const items = req.query.unassigned ?
        await this.service.getUnassigned(req.userID!) :
        await this.service.getByUserID(req.userID!)

      console.log('gotten items', items)
      res.json(items)

    }
    catch (error) {
      console.log('gotten items error', error)
      next(error)
    }
  }

  handlePostItem = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.create(req.userID!, req.body.name, req.body.amount)
      res.json(item)
    } catch (error) {
      console.log('create item error', error)
      next(error)
    }
  }

  validateItemBody(req: RequestWithID, res: Response, next: NextFunction) {
    if (!req.body.name || !req.body.amount) {
      const error = new HTTPError("Please include both name and amount in dollars", 422, new Error("Invalid input"))
      next(error)
    } else {
      next()
    }
  }

  authRequired(req: RequestWithID, res: Response, next: NextFunction) {
    if (!req.cookies || !req.cookies.id) {
      const error = new HTTPError("Please create an account", 401, new Error("Unauthorized request"))
      next(error)
    } else {
      req.userID = req.cookies.id
      next()
    }
  }
}