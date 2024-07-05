import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'

import { Sex, TokenTypes, UserRole } from '~/constants/enums'
import { PaginationReqQuery } from '~/models/requests/Common.requests'

export interface RegisterReqBody {
    name: string
    username: string
    password: string
    confirm_password: string
    sex: Sex
}

export interface LoginReqBody {
    username: string
    password: string
}

export interface LogoutReqBody {
    refresh_token: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    role: UserRole
    token_type: TokenTypes
    iat: number
    exp: number
}

export interface RefreshTokenReqBody {
    refresh_token: string
}

export interface GetProfileReqParams extends ParamsDictionary {
    username: string
}

export interface UpdateMeReqBody {
    name?: string
    username?: string
    sex?: Sex
}

export interface GetAllUsersReqQuery extends PaginationReqQuery {
    name?: string
    is_active?: 'true' | 'false'
}

export interface UpdateIsActiveReqParams extends ParamsDictionary {
    username: string
}

export interface UpdateIsActiveReqBody {
    is_active: boolean
}
