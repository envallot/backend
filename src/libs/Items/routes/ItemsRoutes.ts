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
      this.handlePostItem
    )
    this.router.get(
      "/",
      this.authRequired,
      this.handleGetItemsByUserID
    )
  }


 handleGetItemsByUserID = async (req: any, res: Response, next: NextFunction) => {
    console.log('thiss', this)
    try {
      const items = await this.service.getByUserID(req.userID)
      console.log('gotten items', items)
      res.json(items)
    } catch (error) {
      console.log('gotten items error', error)
      next(error)
    }
  }

 handlePostItem = async(req: RequestWithID, res: Response, next: NextFunction) => {
    console.log('thisss', this)

    try {
      const item = await this.service.create(req.userID!, req.body.name, req.body.amount)
      res.json(item)
    } catch (error) {
      console.log('create item error', error)
      next(error)
    }
  }
  // router.get('/exp', paramCheck.authorize, async (req, res) => {
  //   try {
  //     const expenses = await ExpensesModel.getUnassigned(req.userID)
  //     console.log('*********ExpensesRouterGetExpenses************', expenses)
  //     res.json(expenses)

  //   } catch (e) {
  //     console.log(e)
  //   }
  // })

  // router.get('/:id/byBlock', paramCheck.authorize, async (req, res) => {
  //   try {
  //     const expenses = await ExpensesModel.getByBlock(req.params.id, req.userID)
  //     res.json(expenses)
  //   } catch (error) {
  //     console.log('byBlockError', error)
  //   }
  // })

  // router.delete("/:id", paramCheck.authorize, async (req, res) => {
  //   console.log('delete req.params', req.params)
  //   try {
  //     await ExpensesModel.del(req.params.id)

  //     const newExpenses = await ExpensesModel.getUnassigned(req.userID)
  //     res.json(newExpenses)

  //   } catch (e) {
  //     console.log(e)
  //   }
  // })

  // router.put('/:id/assignBlock', paramCheck.authorize, async (req, res) => {
  //   console.log('blockAssign', req.params.id, req.body.blockID)
  //   try {
  //     await ExpensesModel.assignBlock(req.params.id, req.body.blockID)
  //     const newExpenses = await ExpensesModel.getUnassigned(req.userID)
  //     res.json(newExpenses)
  //   } catch (error) {
  //     console.log('assignBlockError', error)
  //   }
  // })

  // router.put("/:id/unassign", paramCheck.authorize, async (req, res) => {
  //   console.log('unassignBlock', req.params.id)
  //   try {
  //     await ExpensesModel.unassignExpense(req.params.id)
  //     const newExpenses = await ExpensesModel.getUnassigned(req.userID)
  //     res.json(newExpenses)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })

  // router.post(
  //   "/exp",
  //   paramCheck.authorize,
  //   async (req, res) => {
  //     try {
  //       console.log('***************expRoutePostReqBOdy***********', req.body)
  //       await ExpensesModel.add(req.userID, req.body)
  //       // const newExpenses = await ExpensesModel.get(req.userID)
  //       const newExpenses = await ExpensesModel.getUnassigned(req.userID)

  //       res.json(newExpenses)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   })

  // router.put('/:id', paramCheck.authorize, async (req, res) => {
  //   try {
  //     await ExpensesModel.update(req.params.id, req.body)
  //     const newExpenses = await ExpensesModel.getUnassigned(req.userID)
  //     res.json(newExpenses)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
  // module.exports = router;


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