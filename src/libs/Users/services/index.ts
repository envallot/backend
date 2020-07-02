// import { Database } from '../../../Database'
// import * as pg from 'pg'
import { UsersServices } from './UsersServices'
import { usersModel } from '../model'
// const db = new Database(pg)
// call UsersSerices on usersModel

export const usersServices = new UsersServices(usersModel)

