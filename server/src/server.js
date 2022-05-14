import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoConnect from 'config/db'
import rootRouter from 'routes'

const app = express()
const port = process.env.PORT || 8080

// Middlewares
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    optionsSuccessStatus: 200,
    credentials: true,
  })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// set up api route
app.use('/api', rootRouter)

mongoConnect().then(async () => {
  app.listen(port, () => {
    console.log(`node env: ${process.env.NODE_ENV}`)
    console.log(`server listening on port ${port}`)
  })
})
