import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'

import { CONTACT_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const createContactValidator = validate(
    checkSchema(
        {
            verify_access_token: {
                custom: {
                    options: (value) => {
                        if (value === undefined) return true

                        if (value !== 'true' && value !== 'false') {
                            throw new Error(CONTACT_MESSAGES.VERIFY_ACCESS_TOKEN_MUST_BE_A_BOOLEAN)
                        }

                        return true
                    }
                },
                optional: true
            },
            name: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.NAME_IS_REQUIRED
                },
                isString: {
                    errorMessage: CONTACT_MESSAGES.NAME_MUST_BE_A_STRING
                },
                trim: true,
                isLength: {
                    options: {
                        min: 1,
                        max: 100
                    },
                    errorMessage: CONTACT_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
                }
            },
            phone: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.PHONE_NUMBER_IS_REQUIRED
                },
                isMobilePhone: {
                    options: ['vi-VN'],
                    errorMessage: CONTACT_MESSAGES.PHONE_NUMBER_IS_INVALID
                },
                trim: true
            },
            email: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.EMAIL_IS_REQUIRED
                },
                isEmail: {
                    errorMessage: CONTACT_MESSAGES.EMAIL_IS_INVALID
                },
                trim: true
            },
            content: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.CONTENT_IS_REQUIRED
                },
                isString: {
                    errorMessage: CONTACT_MESSAGES.CONTENT_MUST_BE_A_STRING
                },
                trim: true
            }
        },
        ['body', 'query']
    )
)

export const getAllContactsValidator = validate(
    checkSchema(
        {
            is_read: {
                custom: {
                    options: (value) => {
                        if (value === undefined) return true

                        if (value !== 'true' && value !== 'false') {
                            throw new Error(CONTACT_MESSAGES.IS_READ_MUST_BE_A_BOOLEAN)
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

export const updateIsReadStatusValidator = validate(
    checkSchema(
        {
            contact_id: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.CONTACT_ID_IS_REQUIRED
                },
                isMongoId: {
                    errorMessage: CONTACT_MESSAGES.INVALID_CONTACT_ID
                },
                trim: true,
                custom: {
                    options: async (value: string) => {
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: CONTACT_MESSAGES.INVALID_CONTACT_ID,
                                status: HTTP_STATUS.BAD_REQUEST
                            })
                        }

                        const contact = await databaseService.contacts.findOne({
                            _id: new ObjectId(value)
                        })

                        if (contact === null) {
                            throw new ErrorWithStatus({
                                message: CONTACT_MESSAGES.CONTACT_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        return true
                    }
                }
            },
            is_read: {
                notEmpty: {
                    errorMessage: CONTACT_MESSAGES.IS_READ_IS_REQUIRED
                },
                isBoolean: {
                    errorMessage: CONTACT_MESSAGES.IS_READ_MUST_BE_A_BOOLEAN
                }
            }
        },
        ['body', 'params']
    )
)
