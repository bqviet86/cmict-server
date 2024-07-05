import { Query, ParamsDictionary } from 'express-serve-static-core'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export interface CreateContactReqBody {
    name: string
    phone: string
    email: string
    content: string
}

export interface CreateContactReqQuery extends Query {
    verify_access_token?: string
}

export interface GetAllContactsReqQuery extends PaginationReqQuery {
    is_read?: 'true' | 'false'
}

export interface UpdateIsReadStatusReqParams extends ParamsDictionary {
    contact_id: string
}

export interface UpdateIsReadStatusReqBody {
    is_read: boolean
}
