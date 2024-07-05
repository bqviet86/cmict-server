import { Router } from 'express'

import { uploadImageController } from '~/controllers/medias.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload image
 * Path: /upload-image
 * Method: POST
 * Body: { image: max 5 files }
 */
mediasRouter.post('/upload-image', accessTokenValidator, wrapRequestHandler(uploadImageController))

export default mediasRouter
