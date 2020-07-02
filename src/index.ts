import { config } from 'dotenv'
config()
import * as pg from 'pg'
console.log('cnfg', config().parsed)
