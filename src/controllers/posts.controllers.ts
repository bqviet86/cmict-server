import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { POSTS_MESSAGES } from '~/constants/messages'
import {
    CreatePostReqBody,
    DeletePostReqParams,
    GetAllPostsReqQuery,
    GetPostReqParams,
    UpdateApproveStatusReqBody,
    UpdateApproveStatusReqParams,
    UpdatePostReqBody,
    UpdatePostReqParams
} from '~/models/requests/Post.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import postService from '~/services/posts.services'

export const createPostController = async (req: Request<ParamsDictionary, any, CreatePostReqBody>, res: Response) => {
    const user = req.user as User
    const result = await postService.createPost({ user, payload: req.body })

    return res.json({
        message: POSTS_MESSAGES.CREATE_POST_SUCCESSFULLY,
        result
    })
}

export const getAllPostsController = async (
    req: Request<ParamsDictionary, any, any, GetAllPostsReqQuery>,
    res: Response
) => {
    const user_id = req.decoded_authorization?.user_id || ''
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const { title, content, author, category, approved, my_posts } = req.query

    const { posts, total_posts } = await postService.getAllPosts({
        user_id,
        page,
        limit,
        title,
        content,
        author,
        category,
        approved: approved === 'true' ? true : approved === 'false' ? false : undefined,
        my_posts: my_posts === 'true' ? true : my_posts === 'false' ? false : undefined
    })

    return res.json({
        message: POSTS_MESSAGES.GET_ALL_POSTS_SUCCESSFULLY,
        result: {
            posts,
            page,
            limit,
            total_pages: Math.ceil(total_posts / limit)
        }
    })
}

export const getPostController = async (req: Request<GetPostReqParams>, res: Response) => {
    const { slug } = req.params
    const result = await postService.getPost(slug)

    return res.json({
        message: POSTS_MESSAGES.GET_POST_SUCCESSFULLY,
        result
    })
}

export const updateApproveStatusController = async (
    req: Request<UpdateApproveStatusReqParams, any, UpdateApproveStatusReqBody>,
    res: Response
) => {
    const { post_id } = req.params
    const { approved } = req.body
    const result = await postService.updateApproveStatus(post_id, approved)

    return res.json(result)
}

export const updatePostController = async (
    req: Request<UpdatePostReqParams, any, UpdatePostReqBody>,
    res: Response
) => {
    const { post_id } = req.params
    const result = await postService.updatePost(post_id, req.body)

    return res.json({
        message: POSTS_MESSAGES.UPDATE_POST_SUCCESSFULLY,
        result
    })
}

export const deletePostController = async (req: Request<DeletePostReqParams>, res: Response) => {
    const { post_id } = req.params
    const result = await postService.deletePost(post_id)

    return res.json(result)
}
