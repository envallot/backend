import { Query } from '../../../types'

export class UsersModel {
  db: any
  query: any
  constructor(database: any) {
    this.db = database
    this.query = this.db.client.query
  }

  /**
   * Creates a Users table
   * 
   * @returns A promise resolves to a primary key id
   */
  // create(): Promise<any> {
  //   const query: Query = `
  //     CREATE TABLE IF NOT EXISTS
  //       users(
  //         id SERIAL PRIMARY KEY,
  //         username VARCHAR(128),
  //         email VARCHAR(128),
  //         password VARCHAR(128),
  //       )
  //     `;
  //   return this.query(query)
  // }

  /**
   * Adds a new user row. Specifically, all we do is return a unique id.
   * This is for 'registering' users without askign for any info. Later on,
   * after the user gets to know our app, we will ask for an email.
   * 
   * @returns A promise that resolves to an object of all the user data 
   */
  add(): Promise<any> {
    // const query:{text: string, } = {}
    const query: Query = {
      text: `
      INSERT INTO
        users
        VALUES(DEFAULT)
        RETURNING id
      `
    }
    // const values = [
    //   'DEFAULT',
    //   username,
    //   password,
    //   email
    // ]
    console.log('db query ran', { time: Date.now(), ...query })
    return this.query(query)
  }

  /**
   * Updates a user by his id
   * 
   * @param id - The id primary key used to find user
   * 
   * @returns A promise that resolves to an object of the users updated data
   */
  update(id: number, username: string, password: string, email: string): Promise<any> {
    const text = `
      UPDATE users
        users(username, password, email, created_date, modified_date)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
      `
    const values = [
      username,
      password,
      email
    ]
    return this.query(text, values)
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