import { Query } from '../../../types'
import { Model, HTTPError } from '../../utils'

export class EnvelopesModel extends Model {
  constructor(database: any) {
    super(database)
  }

  /**
   * get retrieves all of the items user by a specified user
   * 
   * @param userID ID of user that owns items
   */
  async get(userID: number) {
    try {

      const query = {
        text: `
        SELECT items.id as item_id, envelopes.id as env_id, items.name as item_name, envelopes.name as env_name, items.amount, envelopes.limit_amount
          FROM items FULL JOIN envelopes ON (items.envelope_id = envelopes.id)
          WHERE items.user_id = $1;
          `,
        values: [userID]

      }

      const items = await this.db.poolQuery(query)
      return items.rows

    } catch (error) {
      throw new HTTPError(this._internalErrorMsg, 500, error)
    }
  }

  /**
   * getUnassigned gets the items that belong to a user that are not yet assigned to envelopes
   * @param userID ID of user item belongs to
   */
  // async getUnassigned(userID: number): Promise<any> {
  //   try {

  //     const query: Query = {
  //       text: `
  //       SELECT * FROM items WHERE user_id = $1 AND envelope_id IS NULL
  //       `,
  //       values: [userID]
  //     }
  //     const items = await this.db.poolQuery(query)
  //     return items.rows

  //   } catch (error) {
  //     throw new HTTPError(this._internalErrorMsg, 500, error)
  //   }
  // }

  // /**
  //  * getEnvlope retrieves items that belong to specific envelope
  //  * 
  //  * @param userID ID of user item belongs to
  //  * @param envelopeID ID of envlope item belongs to
  //  */
  // async getByEnvelope(userID: string, envelopeID: string): Promise<any> {
  //   try {

  //     const query: Query = {
  //       text: `
  //       SELECT * FROM items WHERE user_id = $1 AND envelope_id = $2
  //       `,
  //       values: [userID, envelopeID]
  //     }
  //     const items = await this.db.poolQuery(query)
  //     return items.rows

  //   } catch (error) {
  //     throw new HTTPError("No such envelope", 404, error)
  //   }
  // }

  /**
   * add adds an item with user_id of user who added it
   * @param userID ID of owner of item
   */
  async add(userID: string, name: string, limitAmount: number): Promise<any> {
    try {

      const query: Query = {
        text: `
        INSERT INTO envelopes (user_id, name, limit_amount)
          VALUES($1, $2, $3)
        RETURNING *
        `,
        values: [userID, name, limitAmount]
      }
      const item = await this.db.poolQuery(query)
      return item.rows[0]

    } catch (error) {
      throw new HTTPError(this._internalErrorMsg, 500, error)
    }
  }

  /**
   * delete removes item from db by id
   * 
   * @param id id of item to delete
   */
  // async delete(id: string): Promise<number> {
  //   try {

  //     const query: Query = {
  //       text: `
  //       DELETE FROM items WHERE id = $1 RETURNING id
  //       `,
  //       values: [id]
  //     }
  //     const item = await this.db.poolQuery(query)
  //     return item.rows[0].id

  //   } catch (error) {
  //     throw new HTTPError("No such item", 422, error)
  //   }
  // }

  /**
   * 
   * @param id id of item to update
   * @param envelopeID id of envelope we are assigning it to
   */
  // async assign(id: number, envelopeID: number): Promise<any> {
  //   try {

  //     const query: Query = {
  //       text: `
  //       UPDATE items SET envelope_id = $2 WHERE id = $1 RETURNING *
  //       `,
  //       values: [id, envelopeID]
  //     }
  //     const item = await this.db.poolQuery(query)
  //     return item.rows[0]

  //   } catch (error) {
  //     throw new HTTPError("No such item", 422, error)
  //   }
  // }

  /**
   * unassign changes envelope_id to null of specified item
   * @param id id of item to unassign
   */
  // async unassign(id: number): Promise<any> {
  //   try {

  //     const query: Query = {
  //       text: `
  //       UPDATE items SET envelope_id = null WHERE id = $1 RETURNING *
  //       `,
  //       values: [id]
  //     }
  //     const item = this.db.poolQuery(query)
  //     return item.rows[0]

  //   } catch (error) {
  //     throw new HTTPError("No such item", 422, error)
  //   }
  // }

  /**
   * update changes name and amount of specified item
   * @param id id of item to update
   * @param param1 object containing new name and amount
   */
  // async update(id: number, name: string, amount: number, envelopeID: number, ): Promise<any> {
  //   try {
  //     const query: Query = {
  //       text: `
  //       UPDATE items SET envelope_id = $2, name = $3, amount = $4 WHERE id = $1 RETURNING *
  //       `,
  //       values: [id, envelopeID, name, amount]
  //     }
  //     const item = await this.db.poolQuery(query)
  //     return item.rows[0]

  //   } catch (error) {
  //     throw new HTTPError("No such item", 422, error)
  //   }
  // }
}

