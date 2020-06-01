import { config } from 'dotenv'
config()
import * as pg from 'pg'

export class Database {
  client: any
  constructor(pg: any) {
    this.client = new pg.Client()
  }
}



