import { ParamsDictionary } from 'express-serve-static-core'

import { PostCategory } from '~/constants/enums'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export interface CreatePostReqBody {
    title: string
    image: string
    content: string
    category: PostCategory
}

export interface GetAllPostsReqQuery extends PaginationReqQuery {
    verify_access_token: 'true' | 'false'
    title?: string
    content?: string
    author?: string
    category?: PostCategory
    approved?: 'true' | 'false'
    my_posts?: 'true' | 'false'
}

export interface GetPostReqParams extends ParamsDictionary {
    slug: string
}

export interface UpdateApproveStatusReqParams extends ParamsDictionary {
    post_id: string
}

export interface UpdateApproveStatusReqBody {
    approved: boolean
}

export interface UpdatePostReqParams extends ParamsDictionary {
    post_id: string
}

export interface UpdatePostReqBody {
    title?: string
    image?: string
    content?: string
    category?: PostCategory
}

export interface DeletePostReqParams extends ParamsDictionary {
    post_id: string
}
