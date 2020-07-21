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
      this.handleGetEnvelopes
    )
    this.router.put(
      "/",
      this.authRequired,
      this.validateBody,
      this.handlePutEnvelope
    )
    this.router.put(
      "/unassignItem",
      this.authRequired,
      this.handleUnassignItem
    )
    this.router.delete(
      "/:envelopeID",
      this.authRequired,
      this.handleRemoveEnvelope
    )
  }

  handleGetEnvelopes = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const envs = await this.service.getAll(req.userID!)
      console.log('envs')
      res.json(envs)
    } catch (error) {
      next(error)
    }
  }

  handleRemoveEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const itemID = req.query.items ? await this.service.removeEnvAndItems(req.userID!, req.params.envelopeID) :
        await this.service.removeEnvUnassignItems(req.userID!, req.params.envelopeID)
      res.json(itemID)
    } catch (error) {
      next(error)
    }
  }

  handlePutEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const { id, name, limit_amount } = req.body
      const item = await this.service.change(id, name, limit_amount)

      res.json(item)

    } catch (error) {
      next(error)
    }
  }

  handleUnassignItem =  async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const { id, itemID } = req.body
      const envelope = await this.service.unassignItemFromEnvelope(id, itemID)

      res.json(envelope)

    } catch (error) {
      next(error)
    }
  }

  handleGetEnvelopesAndItems = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.get(req.userID!)
      res.json(data)
    }
    catch (error) {
      next(error)
    }
  }

  handlePostEnvelope = async (req: RequestWithID, res: Response, next: NextFunction) => {
    try {
      const item = await this.service.create(req.userID!, req.body.name, req.body.limit_amount)
      res.json(item)
    } catch (error) {
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