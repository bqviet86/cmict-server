import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { PostCategory, UserRole } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { GetAllPostsReqQuery } from '~/models/requests/Post.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { stringEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'

const categoryValues = stringEnumToArray(PostCategory)

const titleSchema: ParamSchema = {
    notEmpty: {
        errorMessage: POSTS_MESSAGES.TITLE_IS_REQUIRED
    },
    isString: {
        errorMessage: POSTS_MESSAGES.TITLE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 1,
            max: 200
        },
        errorMessage: POSTS_MESSAGES.TITLE_LENGTH_MUST_BE_FROM_1_TO_200
    }
}

const imageSchema: ParamSchema = {
    notEmpty: {
        errorMessage: POSTS_MESSAGES.NO_IMAGE_PROVIDED
    },
    isString: {
        errorMessage: POSTS_MESSAGES.IMAGE_MUST_BE_A_STRING
    },
    trim: true,
    isLength: {
        options: {
            min: 25
        },
        errorMessage: POSTS_MESSAGES.IMAGE_NOT_FOUND
    }
}

const contentSchema: ParamSchema = {
    notEmpty: {
        errorMessage: POSTS_MESSAGES.CONTENT_IS_REQUIRED
    },
    isString: {
        errorMessage: POSTS_MESSAGES.CONTENT_MUST_BE_A_STRING
    },
    trim: true
}

const authorSchema: ParamSchema = {
    notEmpty: {
        errorMessage: POSTS_MESSAGES.AUTHOR_IS_REQUIRED
    },
    isString: {
        errorMessage: POSTS_MESSAGES.AUTHOR_MUST_BE_A_STRING
    },
    trim: true
}

const categorySchema: ParamSchema = {
    isString: {
        errorMessage: POSTS_MESSAGES.CATEGORY_MUST_BE_A_STRING
    },
    isIn: {
        options: [categoryValues],
        errorMessage: POSTS_MESSAGES.CATEGORY_MUST_BE_IN_VALUES
    }
}

const postIdSchema: ParamSchema = {
    isString: true,
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: POSTS_MESSAGES.INVALID_POST_ID,
                    status: HTTP_STATUS.BAD_REQUEST
                })
            }

            const { user_id, role } = req.decoded_authorization as TokenPayload
            const post = await databaseService.posts.findOne({
                _id: new ObjectId(value)
            })

            if (post === null) {
                throw new ErrorWithStatus({
                    message: POSTS_MESSAGES.POST_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            if (role !== UserRole.Admin && post.user_id.toString() !== user_id) {
                throw new ErrorWithStatus({
                    message: POSTS_MESSAGES.NOT_HAVE_PERMISSION,
                    status: HTTP_STATUS.FORBIDDEN
                })
            }

            return true
        }
    }
}

export const createPostValidator = validate(
    checkSchema(
        {
            title: titleSchema,
            image: imageSchema,
            content: contentSchema,
            category: categorySchema
        },
        ['body']
    )
)

export const checkPermissionsToGetAllPosts = (
    req: Request<ParamsDictionary, any, any, GetAllPostsReqQuery>,
    res: Response,
    next: NextFunction
) => {
    const { verify_access_token, approved, my_posts } = req.query

    if (verify_access_token === 'false') return next()

    const { role } = req.decoded_authorization as TokenPayload

    if (role === UserRole.Admin || my_posts === 'true') return next()

    if (approved !== 'true') {
        next(
            new ErrorWithStatus({
                message: POSTS_MESSAGES.NOT_HAVE_PERMISSION,
                status: HTTP_STATUS.FORBIDDEN
            })
        )
    }

    next()
}

export const getAllPostsValidator = validate(
    checkSchema(
        {
            verify_access_token: {
                custom: {
                    options: (value) => {
                        if (value === undefined) return true

                        if (value !== 'true' && value !== 'false') {
                            throw new Error(POSTS_MESSAGES.VERIFY_ACCESS_TOKEN_MUST_BE_A_BOOLEAN)
                        }

                        return true
                    }
                },
                optional: true
            },
            title: {
                ...titleSchema,
                optional: true
            },
            content: {
                ...contentSchema,
                optional: true
            },
            author: {
                ...authorSchema,
                optional: true
            },
            category: {
                ...categorySchema,
                optional: true
            },
            approved: {
                custom: {
                    options: (value) => {
                        if (value === undefined) return true

                        if (value !== 'true' && value !== 'false') {
                            throw new Error(POSTS_MESSAGES.APPROVED_MUST_BE_A_BOOLEAN)
                        }

                        return true
                    }
                },
                optional: true
            },
            my_posts: {
                custom: {
                    options: (value) => {
                        if (value === undefined) return true

                        if (value !== 'true' && value !== 'false') {
                            throw new Error(POSTS_MESSAGES.MY_POSTS_MUST_BE_A_BOOLEAN)
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

export const getPostValidator = validate(
    checkSchema(
        {
            slug: {
                isString: {
                    errorMessage: POSTS_MESSAGES.SLUG_MUST_BE_A_STRING
                },
                trim: true
            }
        },
        ['params']
    )
)

export const updateApproveStatusValidator = validate(
    checkSchema(
        {
            post_id: postIdSchema,
            approved: {
                isBoolean: {
                    errorMessage: POSTS_MESSAGES.APPROVED_MUST_BE_A_BOOLEAN
                }
            }
        },
        ['body', 'params']
    )
)

export const updatePostValidator = validate(
    checkSchema(
        {
            post_id: {
                ...postIdSchema,
                optional: true
            },
            title: {
                ...titleSchema,
                optional: true
            },
            image: {
                ...imageSchema,
                optional: true
            },
            content: {
                ...contentSchema,
                optional: true
            },
            category: {
                ...categorySchema,
                optional: true
            }
        },
        ['body', 'params']
    )
)

export const deletePostValidator = validate(
    checkSchema(
        {
            post_id: postIdSchema
        },
        ['params']
    )
)
