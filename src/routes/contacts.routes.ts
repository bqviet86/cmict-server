import { Router } from 'express'

import {
    createContactController,
    getAllContactsController,
    updateIsReadStatusController
} from '~/controllers/contacts.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
    createContactValidator,
    getAllContactsValidator,
    updateIsReadStatusValidator
} from '~/middlewares/contacts.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { UpdateIsReadStatusReqBody } from '~/models/requests/Contact.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const contactsRouter = Router()

/**
 * Description: Create a contact
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateContactReqBody
 * Params: {
 *     verify_access_token: boolean
 * }
 */
contactsRouter.post('/', accessTokenValidator, createContactValidator, wrapRequestHandler(createContactController))

/**
 * Description: Get all contacts
 * Path: /all
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     is_read: boolean
 * }
 */
contactsRouter.get(
    '/all',
    accessTokenValidator,
    isAdminValidator,
    getAllContactsValidator,
    wrapRequestHandler(getAllContactsController)
)

/**
 * Description: Update is read status of a contact
 * Path: /update-is-read-status/:contact_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { contact_id: string }
 * Body: UpdateIsReadStatusReqBody
 */
contactsRouter.patch(
    '/update-is-read-status/:contact_id',
    accessTokenValidator,
    updateIsReadStatusValidator,
    filterMiddleware<UpdateIsReadStatusReqBody>(['is_read']),
    wrapRequestHandler(updateIsReadStatusController)
)

export default contactsRouter
