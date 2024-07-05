import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'

import { UPLOAD_IMAGE_TEMP_DIR } from './constants/dir'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import postsRouter from '~/routes/posts.routes'
import mediasRouter from '~/routes/medias.routes'
import contactsRouter from '~/routes/contacts.routes'
import staticRouter from './routes/static.routes'
import databaseService from '~/services/database.services'
import { initFolder } from './utils/file'

config()

const port = process.env.PORT || 4000
const app = express()

// Init folders
initFolder(UPLOAD_IMAGE_TEMP_DIR)

// Connect to database
databaseService.connect()

// Middlewares
app.use(express.json())
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)

// Routes
app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/medias', mediasRouter)
app.use('/contacts', contactsRouter)
app.use('/static', staticRouter)

// Error handler
app.use(defaultErrorHandler)

// Listen
app.listen(port, () => console.log(`Listen on http://localhost:${port}`))
