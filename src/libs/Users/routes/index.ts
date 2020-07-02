import {usersServices } from '../services'
import { UsersRoutes } from '../routes/UsersRoutes'

export const usersRoutes = new UsersRoutes(usersServices)