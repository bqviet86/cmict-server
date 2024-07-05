import { ObjectId } from 'mongodb'

interface ContactConstructor {
    _id?: ObjectId
    user_id?: ObjectId | null
    name: string
    phone: string
    email: string
    content: string
    is_read?: boolean
    created_at?: Date
    updated_at?: Date
}

export default class Contact {
    _id?: ObjectId
    user_id: ObjectId | null
    name: string
    phone: string
    email: string
    content: string
    is_read: boolean
    created_at: Date
    updated_at: Date

    constructor(contact: ContactConstructor) {
        const date = new Date()

        this._id = contact._id
        this.user_id = contact.user_id || null
        this.name = contact.name
        this.phone = contact.phone
        this.email = contact.email
        this.content = contact.content
        this.is_read = contact.is_read || false
        this.created_at = contact.created_at || date
        this.updated_at = contact.updated_at || date
    }
}
