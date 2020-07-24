import * as pg from 'pg'
import { Query } from './types'

interface Data {
  [key: string]: any
}

export class Database {
  client: pg.Client
  pool: pg.Pool

  constructor(pg: any) {
    this.client = new pg.Client()
    this.pool = new pg.Pool()
    this.initDB()
  }

  async initDB(): Promise<any> {
    try {
      await this.createUsersTable()
      await this.createItemsTable()
      await this.createEnvelopesTable()
    } catch (error) {
      throw new Error(error)
    }
  }

  createItemsTable(): Promise<any> {
    const query: Query = {
      text: `
      CREATE TABLE IF NOT EXISTS
        items(
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(128),
          amount BIGINT DEFAULT 0,
          envelope_id INTEGER 
        )
      `
    }
    return this.poolQuery(query)
  }

  createEnvelopesTable(): Promise<any> {
    const query: Query = {
      text: `
      CREATE TABLE IF NOT EXISTS
        envelopes(
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(128),
          limit_amount BIGINT DEFAULT 0,
          total BIGINT DEFAULT 0
        )
      `
    }
    return this.poolQuery(query)
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

  /**
   * createUpdate returns a template literal that where undefined data is omitted such that we don't 
   * update values with 'null' value unexpectadly
   * @param table the name of the table we want to update
   * @param data the object contains properties where key maps to name of column and values to row data
   */
  createUpdate(table: string, data: Data) {
    var keys = Object.keys(data)
      .filter(function (k) {
        return data[k] !== undefined;
      });
    var names = keys.map(function (k, index) {
      return k + ' = $' + (index + 1);
    })
      .join(', ');
    var values = keys.map(function (k) {
      return data[k];
    });
    return {
      query: `UPDATE ${table} SET ${names}`, 
      values: values
    };
  }

}



