import { Router } from 'express'

import { serveImageController } from '~/controllers/static.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)

export default staticRouter
