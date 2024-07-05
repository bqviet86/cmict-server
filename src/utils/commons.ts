import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import slugify from 'slugify'

import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { verifyToken } from '~/utils/jwt'

export const numberEnumToArray = (numberEnum: { [key: string]: any }) => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const stringEnumToArray = (stringEnum: { [key: string]: any }) => {
    return Object.values(stringEnum).filter((value) => typeof value === 'string') as string[]
}

export const generateRandomStringNumber = (length: number) => {
    let result = ''
    const characters = '0123456789'
    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
}

export const createSlug = (title: string, randomLength: number = 6) => {
    const slug = slugify(title, { lower: true, strict: true })
    const randomString = generateRandomStringNumber(randomLength)

    return `${slug}-${randomString}`
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
    if (req?.query.verify_access_token === 'false') {
        return true
    }

    if (!access_token) {
        throw new ErrorWithStatus({
            message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
        })
    }

    try {
        const decoded_authorization = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
        })
        const user = await databaseService.users.findOne({
            _id: new ObjectId(decoded_authorization.user_id)
        })

        if (req) {
            req.decoded_authorization = decoded_authorization
            req.user = user as User

            return true
        }

        return decoded_authorization
    } catch (error) {
        throw new ErrorWithStatus({
            message: capitalize((error as JsonWebTokenError).message),
            status: HTTP_STATUS.UNAUTHORIZED
        })
    }
}
