import { ObjectId } from 'mongodb'

import { PostCategory } from '~/constants/enums'

interface PostConstructor {
    _id?: ObjectId
    user_id: ObjectId
    title: string
    image: string
    content: string
    author: string
    category: PostCategory
    slug: string
    approved?: boolean
    created_at?: Date
    updated_at?: Date
}

export default class Post {
    _id?: ObjectId
    user_id: ObjectId
    title: string
    image: string
    content: string
    author: string
    category: PostCategory
    slug: string
    approved: boolean
    created_at: Date
    updated_at: Date

    constructor(post: PostConstructor) {
        const date = new Date()

        this._id = post._id
        this.user_id = post.user_id
        this.title = post.title
        this.image = post.image
        this.content = post.content
        this.author = post.author
        this.category = post.category
        this.slug = post.slug
        this.approved = post.approved || false
        this.created_at = post.created_at || date
        this.updated_at = post.updated_at || date
    }
}
