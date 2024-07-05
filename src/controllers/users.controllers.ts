import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'

import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import {
    GetAllUsersReqQuery,
    GetProfileReqParams,
    LoginReqBody,
    LogoutReqBody,
    RefreshTokenReqBody,
    RegisterReqBody,
    TokenPayload,
    UpdateIsActiveReqBody,
    UpdateIsActiveReqParams,
    UpdateMeReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'

config()

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
    const result = await usersService.register(req.body)

    return res.json({
        message: USERS_MESSAGES.REGISTER_SUCCESSFULLY,
        result
    })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
    const { _id, role, is_active } = req.user as User

    if (!is_active) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: USERS_MESSAGES.USER_IS_NOT_ACTIVE
        })
    }

    const result = await usersService.login({ user_id: (_id as ObjectId).toString(), role })

    return res.json({
        message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
        result
    })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersService.logout(refresh_token)

    return res.json(result)
}

export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
    res: Response
) => {
    const { user_id, role, exp } = req.decoded_refresh_token as TokenPayload
    const { refresh_token } = req.body
    const result = await usersService.refreshToken({ user_id, role, exp, refresh_token })

    return res.json({
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
        result
    })
}

export const getMeController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.getMe(user_id)

    return res.json({
        message: USERS_MESSAGES.GET_MY_INFO_SUCCESSFULLY,
        result
    })
}

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
    const user = req.user as User
    return res.json({
        message: USERS_MESSAGES.GET_PROFILE_SUCCESSFULLY,
        result: user
    })
}

export const updateAvatarController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.updateAvatar(user_id, req)

    return res.json({
        message: USERS_MESSAGES.UPDATE_AVATAR_SUCCESSFULLY,
        result
    })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersService.updateMe(user_id, req.body)

    return res.json({
        message: USERS_MESSAGES.UPDATE_ME_SUCCESSFULLY,
        result
    })
}

// Admin

export const getAllUsersController = async (
    req: Request<ParamsDictionary, any, any, GetAllUsersReqQuery>,
    res: Response
) => {
    const { name, is_active } = req.query
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const { users, total_users } = await usersService.getAllUsers({
        name,
        is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
        page,
        limit
    })

    return res.json({
        message: USERS_MESSAGES.GET_ALL_USERS_SUCCESSFULLY,
        result: {
            users,
            page,
            limit,
            total_pages: Math.ceil(total_users / limit)
        }
    })
}

export const updateIsActiveController = async (
    req: Request<UpdateIsActiveReqParams, any, UpdateIsActiveReqBody>,
    res: Response
) => {
    const { username } = req.params
    const { is_active } = req.body
    const result = await usersService.updateIsActive(username, is_active)

    return res.json(result)
}
