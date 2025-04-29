import { Router } from 'express'
import userRouter from './user.route.js'


const rootRouter = Router()

rootRouter.use('/user', userRouter)

export default rootRouter
