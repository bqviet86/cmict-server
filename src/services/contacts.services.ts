import { Document, ObjectId } from 'mongodb'

import { CreateContactReqBody } from '~/models/requests/Contact.requests'
import Contact from '~/models/schemas/Contact.schema'
import databaseService from '~/services/database.services'

class ContactService {
    private commonAggregateContacts: Document[] = [
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                user: {
                    $cond: {
                        if: {
                            $eq: [{ $type: '$user' }, 'missing']
                        },
                        then: null,
                        else: '$user'
                    }
                }
            }
        },
        {
            $project: {
                user_id: 0,
                user: {
                    password: 0
                }
            }
        }
    ]

    async createContact(user_id: string, payload: CreateContactReqBody) {
        const result = await databaseService.contacts.insertOne(
            new Contact({
                ...payload,
                ...(user_id && { user_id: new ObjectId(user_id) })
            })
        )
        const [contact] = await databaseService.contacts
            .aggregate<Contact>([
                {
                    $match: {
                        _id: result.insertedId
                    }
                },
                ...this.commonAggregateContacts
            ])
            .toArray()

        return contact
    }

    async getAllContacts({ page, limit, is_read }: { page: number; limit: number; is_read?: boolean }) {
        const [{ contacts, total_contacts }] = await databaseService.contacts
            .aggregate<{
                contacts: Contact[]
                total_contacts: number
            }>([
                {
                    $match: {
                        ...(is_read !== undefined ? { is_read } : {})
                    }
                },
                {
                    $facet: {
                        contacts: [
                            {
                                $sort: {
                                    created_at: -1
                                }
                            },
                            {
                                $skip: limit * (page - 1)
                            },
                            {
                                $limit: limit
                            },
                            ...this.commonAggregateContacts
                        ],
                        total: [
                            {
                                $count: 'total_contacts'
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: '$total',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        contacts: '$contacts',
                        total_contacts: '$total.total_contacts'
                    }
                }
            ])
            .toArray()

        return {
            contacts: contacts || [],
            total_contacts: total_contacts || 0
        }
    }

    async updateIsReadStatus(contact_id: string, is_read: boolean) {
        await databaseService.contacts.updateOne(
            {
                _id: new ObjectId(contact_id)
            },
            {
                $set: {
                    is_read
                }
            }
        )

        const [contact] = await databaseService.contacts
            .aggregate<Contact>([
                {
                    $match: {
                        _id: new ObjectId(contact_id)
                    }
                },
                ...this.commonAggregateContacts
            ])
            .toArray()

        return contact
    }
}

const contactService = new ContactService()

export default contactService
