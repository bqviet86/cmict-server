import { ObjectId } from 'mongodb'

import { UserRole, Sex } from '~/constants/enums'

interface UserConstructor {
    _id?: ObjectId
    name: string
    username: string
    password: string
    sex: Sex
    role?: UserRole
    avatar?: string
    is_active?: boolean
    created_at?: Date
    updated_at?: Date
}

export default class User {
    _id?: ObjectId
    name: string
    username: string
    password: string
    sex: Sex
    role: UserRole
    avatar: string
    is_active: boolean
    created_at: Date
    updated_at: Date

    constructor(user: UserConstructor) {
        const date = new Date()

        this._id = user._id
        this.name = user.name
        this.username = user.username
        this.password = user.password
        this.sex = user.sex
        this.role = user.role || UserRole.User
        this.avatar = user.avatar || ''
        this.is_active = user.is_active || true
        this.created_at = user.created_at || date
        this.updated_at = user.updated_at || date
    }
}
