import { config } from 'dotenv'
config()
import * as pg from 'pg'
console.log('cnfg', config)

interface Query {
  text: string;
  values: [string];
}

export class Database {
  client: pg.Client
  pool: pg.Pool
  constructor(pg: any) {
    
    this.client = new pg.Client()
    this.pool = new pg.Pool()
  }

  async initDB() {

  }

  // clientQuery(text: string, params: [], callback: (err: any, res: any) => void): any {
  //   const start = Date.now()
  //   return this.client.query(text, params, (err: any, res: any) => {
  //     const duration = Date.now() - start
  //     console.log('executed query', { text, start, duration, rows: res.rowCount })
  //     callback(err, res)
  //   })
  // }

  /**
   * In clientQuery, we are using a client specifically to avoid a pool query breaking up a 
   * transaction in mutliple single queries. We also hook into the async process to keep track
   * of a start and duration time for logging purposes. Logging at this level prevents code
   * duplication later on.
   * 
   * @param query The query passed by to us by a service
   */
  async clientQuery(query: Query): Promise<any> {
    try {
      const start = Date.now()
      const result = await this.client.query(query)
      const duration = Date.now() - start
      console.log('executed query', { text: query.text, start, duration, rows: result.rowCount })
      return result
    } catch(error){
      console.log('rejected query', { text: query.text, ...error })
      throw new Error(error)
    }
  }

  /**
   * In clientQuery, we are using a pool, which is good for many small queries. If a query does
   * not require a transaction, we use this in order to avoid the overhead of making a singular
   * client connection and using up space in the client queue
   * 
   * @param query The query passed by to us by a service
   */
  async poolQuery(query: Query): Promise<any> {
    try {
      const start = Date.now()
      const result = await this.pool.query(query)
      const duration = Date.now() - start
      console.log('executed query', { text: query.text, start, duration, rows: result.rowCount })
      return result
    } catch(error){
      console.log('rejected query', { text: query.text, ...error })
      throw new Error(error)
    }
  }

}



