import { Router } from 'express'

import {
    createPostController,
    deletePostController,
    getAllPostsController,
    getPostController,
    updateApproveStatusController,
    updatePostController
} from '~/controllers/posts.controllers'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { filterMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
    checkPermissionsToGetAllPosts,
    createPostValidator,
    deletePostValidator,
    getAllPostsValidator,
    getPostValidator,
    updateApproveStatusValidator,
    updatePostValidator
} from '~/middlewares/posts.middlewares'
import { UpdateApproveStatusReqBody, UpdatePostReqBody } from '~/models/requests/Post.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const postsRouter = Router()

/**
 * Description: Create a post
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreatePostReqBody
 */
postsRouter.post('/', accessTokenValidator, createPostValidator, wrapRequestHandler(createPostController))

/**
 * Description: Get all posts
 * Path: /all
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {
 *     verify_access_token: boolean
 *     page: number
 *     limit: number
 *     title?: string
 *     content?: string
 *     author?: string
 *     category?: PostCategory
 *     approved?: boolean
 *     my_posts?: boolean
 * }
 */
postsRouter.get(
    '/all',
    accessTokenValidator,
    checkPermissionsToGetAllPosts,
    getAllPostsValidator,
    paginationValidator,
    wrapRequestHandler(getAllPostsController)
)

/**
 * Description: Get a post
 * Path: /:slug
 * Method: GET
 * Params: { slug: string }
 */
postsRouter.get('/:slug', getPostValidator, wrapRequestHandler(getPostController))

/**
 * Description: Update approve status of a post
 * Path: /update-approved-status/:post_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { post_id: string }
 * Body: UpdateApproveStatusReqBody
 */
postsRouter.patch(
    '/update-approved-status/:post_id',
    accessTokenValidator,
    isAdminValidator,
    updateApproveStatusValidator,
    filterMiddleware<UpdateApproveStatusReqBody>(['approved']),
    wrapRequestHandler(updateApproveStatusController)
)

/**
 * Description: Update a post
 * Path: /:post_id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { post_id: string }
 * Body: UpdatePostReqBody
 */
postsRouter.patch(
    '/:post_id',
    accessTokenValidator,
    updatePostValidator,
    filterMiddleware<UpdatePostReqBody>(['title', 'image', 'content', 'category']),
    wrapRequestHandler(updatePostController)
)

/**
 * Description: Delete a post
 * Path: /:post_id
 * Method: DELETE
 * Headers: { Authorization: Bearer <access_token> }
 * Params: { post_id: string }
 */
postsRouter.delete('/:post_id', accessTokenValidator, deletePostValidator, wrapRequestHandler(deletePostController))

export default postsRouter
