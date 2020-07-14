import { EnvelopesServices } from "../services/EnvelopesServices";
import { Routes, RequestWithID, HTTPError } from "../../utils";
import { Response, NextFunction } from "express";

export class EnvelopesRoutes extends Routes {
  service: EnvelopesServices
  constructor(itemsServices: EnvelopesServices) {
    super("/envelopes")
    this.service = itemsServices
    this.initRoutes()
  }

  initRoutes() {
    this.router.post(
      "/",
      this.authRequired,
      this.validateBody,
      this.handlePostEnvelope
    )
    this.router.get(
      "/",
      this.authRequired,
      this.handleGetEnvelopesAndItems
    )
    this.router.put (
      "/",
      this.authRequired,
      this.validateBody,
      this.handlePutEnvelope
    )
    // this.router.get(
    //   "/",
    //   this.authRequired,
    //   this.handleGetItems
    // )
    // this.router.put(
    //   "/",
    //   this.authRequired,
    //   this.validateItemBody,
    //   this.handlePutItem
    // )
    // this.router.delete(
    //   "/:itemID",
    //   this.authRequired,
    //   this.validateItemBody,
    //   this.handleRemoveItem
    // )
  }

  // handleRemoveItem = async (req: RequestWithID, res: Response, next: NextFunction) => {
  //   try {
  //     const itemID = await this.service.remove(req.params.itemID)
  //     res.json(itemID)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  // handleGetItemsByEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
  //   try {
  //     const { envelopeID } = req.params
  //     const items = await this.service.getByEnvelope(req.userID!, envelopeID)
  //     res.json(items)
  //   } catch(error) {
  //     console.log(error)
  //     next(error)
  //   }
  // }

  handlePutEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const { id, name, limit_amount} = req.body
      const item = await this.service.change(id, name, limit_amount)
      
      res.json(item)

    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  handleGetEnvelopesAndItems = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      // const items = req.query.join ?
      //   await this.service.getUnassigned(req.userID!) :
      //   await this.service.getByUserID(req.userID!)

      const data = await this.service.get(req.userID!)

      console.log('gotten items', data)
      res.json(data)

    }
    catch (error) {
      console.log('gotten items error', error)
      next(error)
    }
  }

  handlePostEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.create(req.userID!, req.body.name, req.body.limit_amount)
      res.json(item)
    } catch (error) {
      console.log('create item error', error)
      next(error)
    }
  }

  validateBody(req: RequestWithID, res: Response, next: NextFunction) {
    if (!req.body.name || !req.body.limit_amount) {
      const error = new HTTPError("Please include a name and limit amount in dollars", 422, new Error("Invalid input"))
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