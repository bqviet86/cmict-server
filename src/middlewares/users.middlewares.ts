import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

import { Sex, UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { LoginReqBody, TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { stringEnumToArray, verifyAccessToken } from '~/utils/commons'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const sexValues = stringEnumToArray(Sex)

const nameSchema: ParamSchema = {
    notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
    },
    isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
    }
}

const usernameSchema: ParamSchema = {
    notEmpty: {
        errorMessage: USERS_MESSAGES.USERNAME_IS_REQUIRED
    },
    trim: true
}

const passwordSchema: ParamSchema = {
    notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
    },
    isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
    }
}

const confirmPasswordSchema: ParamSchema = {
    notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
    },
    isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
    },
    custom: {
        options: (value: string, { req }) => {
            if (value !== req.body.password) {
                throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }

            return true
        }
    }
}

const sexSchema: ParamSchema = {
    isIn: {
        options: [sexValues],
        errorMessage: USERS_MESSAGES.SEX_IS_INVALID
    }
}

export const registerValidator = validate(
    checkSchema(
        {
            name: nameSchema,
            username: {
                ...usernameSchema,
                custom: {
                    options: async (value: string) => {
                        const isExistUsername = await userService.checkUsernameExist(value)

                        if (isExistUsername) {
                            throw new Error(USERS_MESSAGES.USERNAME_ALREADY_EXISTS)
                        }

                        return true
                    }
                }
            },
            password: passwordSchema,
            confirm_password: confirmPasswordSchema,
            sex: sexSchema
        },
        ['body']
    )
)

export const loginValidator = validate(
    checkSchema(
        {
            username: {
                ...usernameSchema,
                custom: {
                    options: async (value: string, { req }) => {
                        const user = await databaseService.users.findOne({
                            username: value
                        })

                        if (user === null) {
                            throw new Error(USERS_MESSAGES.USERNAME_NOT_FOUND)
                        }

                        ;(req as Request).user = user

                        return true
                    }
                }
            },
            password: {
                ...passwordSchema,
                custom: {
                    options: async (value: string, { req }) => {
                        const { username } = (req as Request<ParamsDictionary, any, LoginReqBody>).body
                        const user = await databaseService.users.findOne({ username })

                        if (user && hashPassword(value) !== user.password) {
                            throw new Error(USERS_MESSAGES.INCORRECT_PASSWORD)
                        }

                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                trim: true,
                custom: {
                    options: async (value: string, { req }) => {
                        const access_token = (value || '').split(' ')[1]
                        return verifyAccessToken(access_token, req as Request)
                    }
                }
            }
        },
        ['headers']
    )
)

export const refreshTokenValidator = validate(
    checkSchema(
        {
            refresh_token: {
                trim: true,
                custom: {
                    options: async (value: string, { req }) => {
                        if (!value) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        }

                        try {
                            const [decoded_refresh_token, refresh_token] = await Promise.all([
                                verifyToken({
                                    token: value,
                                    secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                                }),
                                databaseService.refreshTokens.findOne({ token: value })
                            ])

                            if (refresh_token === null) {
                                throw new ErrorWithStatus({
                                    message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }

                            ;(req as Request).decoded_refresh_token = decoded_refresh_token
                        } catch (error) {
                            if (error instanceof JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: capitalize(error.message),
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }

                            throw error
                        }

                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const getProfileValidator = validate(
    checkSchema(
        {
            username: {
                ...usernameSchema,
                custom: {
                    options: async (value: string, { req }) => {
                        const user = await databaseService.users.findOne(
                            {
                                username: value
                            },
                            {
                                projection: {
                                    password: 0
                                }
                            }
                        )

                        if (user === null) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.PROFILE_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        ;(req as Request).user = user

                        return true
                    }
                }
            }
        },
        ['params']
    )
)

export const updateMeValidator = validate(
    checkSchema({
        name: {
            ...nameSchema,
            optional: true
        },
        username: {
            ...usernameSchema,
            optional: true
        },
        sex: {
            ...sexSchema,
            optional: true
        }
    })
)

export const isAdminValidator = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.decoded_authorization as TokenPayload

    if (role !== UserRole.Admin) {
        return next(
            new ErrorWithStatus({
                message: USERS_MESSAGES.PERMISSION_DENIED,
                status: HTTP_STATUS.FORBIDDEN
            })
        )
    }

    next()
}

export const getAllUsersValidator = validate(
    checkSchema(
        {
            name: {
                ...nameSchema,
                optional: true
            },
            is_active: {
                custom: {
                    options: (value: string) => {
                        if (value && !['true', 'false'].includes(value)) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.IS_ACTIVE_MUST_BE_A_BOOLEAN,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        return true
                    }
                },
                optional: true
            }
        },
        ['query']
    )
)

export const updateIsActiveValidator = validate(
    checkSchema(
        {
            username: {
                ...usernameSchema,
                custom: {
                    options: async (value: string) => {
                        const user = await databaseService.users.findOne({ username: value })

                        if (user === null) {
                            throw new ErrorWithStatus({
                                message: USERS_MESSAGES.USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        return true
                    }
                }
            },
            is_active: {
                isBoolean: {
                    errorMessage: USERS_MESSAGES.IS_ACTIVE_MUST_BE_A_BOOLEAN
                }
            }
        },
        ['body', 'params']
    )
)
