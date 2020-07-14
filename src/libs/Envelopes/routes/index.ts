import { envelopesServices } from '../services'
import { EnvelopesRoutes } from './EnvelopesRoutes'

export const envelopesRoutes = new EnvelopesRoutes(envelopesServices)