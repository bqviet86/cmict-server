import { Router } from 'express'

import {
    getAllUsersController,
    getMeController,
    getProfileController,
    loginController,
    logoutController,
    refreshTokenController,
    registerController,
    updateAvatarController,
    updateIsActiveController,
    updateMeController
} from '~/controllers/users.controllers'
import { filterMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
    accessTokenValidator,
    getAllUsersValidator,
    getProfileValidator,
    isAdminValidator,
    loginValidator,
    refreshTokenValidator,
    registerValidator,
    updateIsActiveValidator,
    updateMeValidator
} from '~/middlewares/users.middlewares'
import { UpdateIsActiveReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: RegisterReqBody
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { username: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description: Get my info
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Get profile
 * Path: /:username
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Params: { username: string }
 */
usersRouter.get(
    '/:username',
    accessTokenValidator,
    isAdminValidator,
    getProfileValidator,
    wrapRequestHandler(getProfileController)
)

/**
 * Description: Update my avatar
 * Path: /update-avatar
 * Method: PATCH
 * Body: { image: max 1 file }
 */
usersRouter.patch('/update-avatar', accessTokenValidator, wrapRequestHandler(updateAvatarController))

/**
 * Description: Update my info
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateMeReqBody
 */
usersRouter.patch(
    '/me',
    accessTokenValidator,
    updateMeValidator,
    filterMiddleware<UpdateMeReqBody>(['name', 'username', 'sex']),
    wrapRequestHandler(updateMeController)
)

// Admin routes

/**
 * Description: Get all users
 * Path: /admin/all-users
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { name?: string, is_active?: boolean, page: number, limit: number }
 */
usersRouter.get(
    '/admin/all-users',
    accessTokenValidator,
    isAdminValidator,
    getAllUsersValidator,
    paginationValidator,
    wrapRequestHandler(getAllUsersController)
)

/**
 * Description: Update user is_active
 * Path: /admin/update-active-status/:username
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Params: { username: string }
 * Body: { is_active: boolean }
 */
usersRouter.patch(
    '/admin/update-active-status/:username',
    accessTokenValidator,
    isAdminValidator,
    updateIsActiveValidator,
    filterMiddleware<UpdateIsActiveReqBody>(['is_active']),
    wrapRequestHandler(updateIsActiveController)
)

export default usersRouter
