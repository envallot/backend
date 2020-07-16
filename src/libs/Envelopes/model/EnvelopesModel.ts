import { Query } from '../../../types'
import { Model, HTTPError } from '../../utils'

export class EnvelopesModel extends Model {
  constructor(database: any) {
    super(database)
  }

  async getAll(userID: number) {
    try {
      const query:Query = {
        text:`
        SELECT * FROM envelopes WHERE user_id = $1;
        `,
        values: [userID]
      }

      const envs = await this.db.poolQuery(query)
      return envs.rows
    } catch (error) {
      throw new HTTPError(this._internalErrorMsg, 500, error)
    }
  }

  /**
   * get retrieves all the items joined with their corresponding envelopes that belong to a user
   * 
   * @param userID ID of user that owns items
   */
  async get(userID: number) {
    try {

      // const query = {
      //   text: `
      //   SELECT items.id as item_id, envelopes.id as env_id, items.name as item_name, envelopes.name as env_name, items.amount, envelopes.limit_amount
      //     FROM items FULL JOIN envelopes ON (items.envelope_id = envelopes.id)
      //     WHERE items.user_id = $1;
      //     `,
      //   values: [userID]
      // }

      const query = {
        text: `
        SELECT items.id as item_id, envelopes.id as env_id, items.name as item_name, envelopes.name as env_name, items.amount, envelopes.limit_amount
          FROM envelopes FULL JOIN items ON (envelopes.id = items.envelope_id)
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
   * add adds an envelope with user_id of user who added it
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
   * delete removes envelope and unassigns its items 
   * 
   * @param id id of item to delete
   */
  async delete(id: string): Promise<number> {
    const client = await this.db.pool.connect()
    console.log('delete env invoked', client)

    try {
      client.query('BEGIN')

      const updateItemsQuery: Query = {
        text: `
        UPDATE items SET envelope_id = NULL
          WHERE envelope_id = $1;
        `,
        values: [id]
      }
      await client.query(updateItemsQuery)

      const deleteEvenlopeQuery: Query = {
        text: `
        DELETE FROM envelopes WHERE id = $1 RETURNING id
        `,
        values: [id]
      }
      const itemID = await client.query(deleteEvenlopeQuery)

      await client.query('COMMIT')

      return itemID.rows[0].id

    } catch (error) {
      await client.query('ROLLBACK')
      throw new HTTPError("No such envelope", 422, error)

    } finally {
      client.release()
    }
  }


  /**
   * update changes name and amount of specified item
   * @param id id of item to update
   * @param param1 object containing new name and amount
   */
  async update(id: number, name: string, limitAmount: number): Promise<any> {
    try {
      const query: Query = {
        text: `
        UPDATE envelopes SET name = $2, limit_amount = $3 
        WHERE id = $1 
        RETURNING *
        `,
        values: [id, name, limitAmount]
      }
      const item = await this.db.poolQuery(query)
      return item.rows[0]

    } catch (error) {
      throw new HTTPError("No such item", 422, error)
    }
  }
}

