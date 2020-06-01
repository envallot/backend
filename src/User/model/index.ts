import { Database } from '../../Database'
import * as pg from 'pg'
import { UsersModel } from './UsersModel'

const db = new Database(pg)

export const usersModel = new UsersModel(db)