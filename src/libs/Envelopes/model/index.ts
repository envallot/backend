import { Database } from '../../../Database'
import * as pg from 'pg'
import { EnvelopesModel } from './EnvelopesModel'

const db = new Database(pg)

export const envelopesModel = new EnvelopesModel(db)