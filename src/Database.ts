import * as pg from 'pg'
import { Query } from './types'

export class Database {
  client: pg.Client
  pool: pg.Pool
  config: any

  constructor(pg: any) {
    this.client = new pg.Client(this.config)
    this.pool = new pg.Pool(this.config)
    this.initDB()
  }

  async initDB(): Promise<any> {
    try {
      await this.createUsersTable()
    } catch (error) {
      throw new Error(error)
    }
  }

  createUsersTable(): Promise<any> {
    const query: Query = {
      text: `
      CREATE TABLE IF NOT EXISTS
        users(
          id SERIAL PRIMARY KEY,
          username VARCHAR(128),
          email VARCHAR(128),
          password VARCHAR(128)
        )
      `
    }

    return this.poolQuery(query)
  }


  /**
   * In clientQuery, we are using a client specifically to avoid a pool query breaking up a 
   * transaction in mutliple single queries. We also hook into the async process to keep track
   * of a start and duration time for logging purposes. Logging at this level prevents code
   * duplication later on.
   * 
   * @param query The query passed to us by a service
   */
  async clientQuery(query: Query): Promise<any> {
    const client = await this.pool.connect()
    try {
      const start = Date.now()
      const result = await client.query(query)
      const duration = Date.now() - start
      console.log('executed query', { ...query, start, duration, ...result })
      return result
    } catch (error) {
      console.log('rejected query', { ...query, ...error })
      throw new Error(error)
    }
    finally {
      client.release()
    }
  }

  /**
   * In clientQuery, we are using a pool, which is good for many small queries. If a query does
   * not require a transaction, we use this in order to avoid the overhead of making a singular
   * client connection and using up space in the client queue
   * 
   * @param query The query passed to us by a service
   */
  async poolQuery(query: Query): Promise<any> {
    try {
      const start = Date.now()
      const result = await this.pool.query(query)
      const duration = Date.now() - start
      console.log('executed query', { ...query, start, duration, ...result })
      return result
    } catch (error) {
      console.log('rejected query', { ...query, ...error })
      throw new Error(error)
    }
  }

}



