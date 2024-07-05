import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { CONTACT_MESSAGES } from '~/constants/messages'
import {
    CreateContactReqBody,
    CreateContactReqQuery,
    GetAllContactsReqQuery,
    UpdateIsReadStatusReqBody,
    UpdateIsReadStatusReqParams
} from '~/models/requests/Contact.requests'
import contactService from '~/services/contacts.services'

export const createContactController = async (
    req: Request<ParamsDictionary, any, CreateContactReqBody, CreateContactReqQuery>,
    res: Response
) => {
    const user_id = req.decoded_authorization?.user_id || ''
    const result = await contactService.createContact(user_id, req.body)

    return res.json({
        message: CONTACT_MESSAGES.CREATE_CONTACT_SUCCESSFULLY,
        result
    })
}

export const getAllContactsController = async (
    req: Request<ParamsDictionary, any, any, GetAllContactsReqQuery>,
    res: Response
) => {
    const { is_read } = req.query
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const { contacts, total_contacts } = await contactService.getAllContacts({
        page,
        limit,
        is_read: is_read === 'true' ? true : is_read === 'false' ? false : undefined
    })

    return res.json({
        message: CONTACT_MESSAGES.GET_ALL_CONTACTS_SUCCESSFULLY,
        result: {
            contacts,
            page,
            limit,
            total_pages: Math.ceil(total_contacts / limit)
        }
    })
}

export const updateIsReadStatusController = async (
    req: Request<UpdateIsReadStatusReqParams, any, UpdateIsReadStatusReqBody>,
    res: Response
) => {
    const { contact_id } = req.params
    const { is_read } = req.body
    const result = await contactService.updateIsReadStatus(contact_id, is_read)

    return res.json({
        message: CONTACT_MESSAGES.UPDATE_IS_READ_STATUS_SUCCESSFULLY,
        result
    })
}
