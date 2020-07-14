import { Database } from '../../../Database'
import * as pg from 'pg'
import { ItemsModel } from './ItemsModel'

const db = new Database(pg)

export const itemsModel = new ItemsModel(db)