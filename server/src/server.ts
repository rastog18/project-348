import 'dotenv/config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'

import mongoConnect from '@/config/db'
import initializeAuth from '@/config/passport'
import rootRouter from '@/routes'

const app = express()
const port = process.env.PORT || 8080

// Middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
)
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true,
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// need cookie parser for signed cookies. make sure that the secret is same with express-session's
app.use(cookieParser(process.env.SESSION_SECRET || 'secret'))
app.use(passport.initialize())
app.use(passport.session())

initializeAuth()

// set up api route
app.use('/api', rootRouter)

mongoConnect().then(async () => {
  app.listen(port, () => {
    console.log(`node env: ${process.env.NODE_ENV}`)
    console.log(`server listening on port ${port}`)
  })
})
