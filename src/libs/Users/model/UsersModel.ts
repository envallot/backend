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

    } catch(error) {
      throw new HTTPError(this._internalErrorMsg, 500, error)
    }
  }

  /**
   * Updates a user by his id
   * 
   * @param id - The id primary key used to find user
   * 
   * @returns A promise that resolves to an object of the users updated data
   */
  async update(id: number, username: string, password: string, email: string): Promise<any> {
    const text = `
      UPDATE users
        users(username, password, email, created_date, modified_date)
        WHERE id = $1
        VALUES($2, $3, $4, $5)
        RETURNING *
      `
    const values = [
      id,
      username,
      password,
      email
    ]
    const user = await this.db.poolQuery(text, values)
    return user.rows[0]
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
  get() {

  }

}