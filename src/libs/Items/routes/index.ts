import {itemsServices } from '../services'
import { ItemsRoutes } from '../routes/ItemsRoutes'

export const itemsRoutes = new ItemsRoutes(itemsServices)