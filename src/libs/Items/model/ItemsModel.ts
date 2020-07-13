import { Query } from '../../../types'

export class ItemsModel {
  db: any
  query: any
  constructor(database: any) {
    this.db = database
    this.query = this.db.client.query
  }

  /**
   * get retrieves all of the items user by a specified user
   * 
   * @param userID ID of user that owns items
   */
  get(userID: number) {
    const query: Query = {
      text: `
      SELECT * FROM items WHERE user_id = $1
      `,
      values: [userID]
    }
    return this.db.poolQuery(query)

  }

  /**
   * getUnassigned gets the items that belong to a user that are not yet assigned to envelopes
   * @param userID ID of user item belongs to
   */
  getUnassigned(userID: number): Promise<any> {
    const query: Query = {
      text: `
      SELECT * from items WHERE user_id = $1 AND envelope_id = null
      `,
      values: [userID]
    }
    return this.db.poolQuery(query)
  }

  /**
   * getEnvlope retrieves items that belong to specific envelope
   * 
   * @param userID ID of user item belongs to
   * @param envelopeID ID of envlope item belongs to
   */
  getByEnvelope(userID: number, envelopeID: number): Promise<any> {
    const query: Query = {
      text: `
      SELECT * FROM items WHERE user_id = $1 AND envelope_id = $2
      `,
      values: [userID, envelopeID]
    }
    return this.db.poolQuery(query)
  }

  /**
   * add adds an item with user_id uf user who added it
   * @param userID ID of owner of item
   */
  add(userID: number): Promise<any> {
    const query: Query = {
      text: `
      INSERT INTO items WHERE user_id = $1
      `,
      values: [userID]
    }
    return this.db.poolQuery(query)
  }

  /**
   * delete removes item from db by id
   * 
   * @param id id of item to delete
   */
  delete(id: number): Promise<any> {
    const query: Query = {
      text: `
      DELETE FROM WHERE id = $1 RETURNING id
      `,
      values: [id]
    }
    return this.db.poolQuery(query)
  }

  /**
   * 
   * @param id id of item to update
   * @param envelopeID id of envelope we are assigning it to
   */
  assign(id: number, envelopeID: number): Promise<any> {
    const query: Query = {
      text: `
      UPDATE items SET envelope_id = $2 WHERE id = $1 RETURNING *
      `,
      values: [id, envelopeID]
    }
    return this.db.poolQuery(query)
  }

  /**
   * unassign changes envelope_id to null of specified item
   * @param id id of item to unassign
   */
  unassign(id: number): Promise<any> {
    const query: Query = {
      text: `
      UPDATE items SET envelope_id = null WHERE id = $1 RETURNING *
      `,
      values: [id]
    }
    return this.db.poolQuery(query)
  }

  /**
   * update changes name and amount of specified item
   * @param id id of item to update
   * @param param1 object containing new name and amount
   */
  update (id:number, { name, amount }:any) :Promise<any> {
    const query: Query = {
      text: `
      UPDATE items SET name = $2 amount = $3 WHERE id = $1 RETURNING *
      `,
      values: [id, name, amount]
    }
    return this.db.poolQuery(query)
  }
}

