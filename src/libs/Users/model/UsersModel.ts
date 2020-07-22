import { Query } from '../../../types'
import { HTTPError, Model } from '../../utils'

export class UsersModel extends Model {
  constructor(database: any) {
    super(database)
  }

  /**
   * Adds a new user row. Specifically, all we do is return a unique id.
   * This is for 'registering' users without askign for any info. Later on,
   * after the user gets to know our app, we will ask for an email.
   * 
   * @returns A promise that resolves to an object of all the user data 
   */
  async add(): Promise<number> {
    try {
      
      const query: Query = {
        text: `
        INSERT INTO
        users
        VALUES(DEFAULT)
        RETURNING id
        `
      }
      
      const res = await this.db.poolQuery(query)
      return res.rows[0].id

    } catch (error) {
      throw new HTTPError(this._internalErrorMsg, 500, error)
    }
  }

  /**
   * Updates a user by his id
   * 
   * @param- The id primary key used to find user and data to update
   * 
   * @returns A promise that resolves to an object of the users updated data
   */
  async update(id: number, username: string, email: string): Promise<any> {
    try { 
      
      const query: Query = {
        text: `
        UPDATE users
        SET username = $2, email = $3
        WHERE id = $1
        RETURNING id, email, username
        `,
        values: [
          id,
          username,
          email
        ]
      }
      
      const user = await this.db.poolQuery(query)
     
      return user.rows[0]
    } catch (error) {
      throw new HTTPError("No such user", 422, error)
    }
  }

  /**
   * Deletes a user by his id
   * 
   * @param id - The id primary key used to find user
   * 
   * @returns A promise that resolves to the id of the deleted user
   */
  delete() {

  }

  /**
   * Gets a user by his id
   * 
   * @param id - The id primary key used to find user
   * 
   * @returns A promise that resolves to an object of the users data
   */
  async get(userID: number) { 
    try {
      
      const query: Query = {
        text: `
        SELECT id, username, email
        FROM users
        WHERE id = $1
        `,
        values: [userID]
      }
      
      const user = await this.db.poolQuery(query)
      
      return user.rows[0]
    }
    catch (error) {
      throw new HTTPError("No such user", 422, error)
    }
  }
}