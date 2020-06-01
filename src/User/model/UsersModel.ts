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
  create():Promise<any> {
    const text = `
      CREATE TABLE IF NOT EXISTS
        users(
          id SERIAL PRIMARY KEY,
          username VARCHAR(128),
          email VARCHAR(128),
          password VARCHAR(128),
          created_date TIMESTAMP,timestamp default current_timestamp

          modified_date TIMESTAMP
        )
      `;
    return this.query(text)
  }

  /**
   * Adds a new user row
   * 
   * @param name - The name a user wants to be referred by, nullable and not unique
   * @param password - The password for authentication, nullable
   * @param email - The user's email, unique but nullable
   * 
   * @returns A promise that resolves to an object of all the user data 
   */
  add(username: string, password: string, email: string): Promise<any> {
    const text = `
      INSERT INTO
        users(username, password, email)
        VALUES($1, $2, $3)
        RETURNING *
      `
    const values = [
      'DEFAULT',
      username,
      password,
      email
    ]
    return this.query(text, values)
  }

  /**
   * Updates a user by his id
   * 
   * @param id - The id primary key used to find user
   * 
   * @returns A promise that resolves to an object of the users updated data
   */
  update(id: number,username: string, password: string, email: string):Promise<any> {
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