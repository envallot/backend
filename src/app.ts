import express, { Router } from 'express'
import { applyMiddleware } from './middleware'

export const app = express()

applyMiddleware(app)
