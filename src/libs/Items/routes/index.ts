import {itemsServices } from '../services'
import { itemsRoutes } from '../routes/itemsRoutes'

export const itemsRoutes = new ItemsRoutes(itemsServices)