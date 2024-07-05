import { Document, ObjectId } from 'mongodb'

import { PostCategory } from '~/constants/enums'
import { POSTS_MESSAGES } from '~/constants/messages'
import { CreatePostReqBody, UpdatePostReqBody } from '~/models/requests/Post.requests'
import Post from '~/models/schemas/Post.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { createSlug } from '~/utils/commons'

class PostService {
    private commonAggregatePosts: Document[] = [
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
                path: '$user'
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

    async createPost({ user, payload }: { user: User; payload: CreatePostReqBody }) {
        const result = await databaseService.posts.insertOne(
            new Post({
                ...payload,
                user_id: user._id as ObjectId,
                author: user.name,
                slug: createSlug(payload.title)
            })
        )
        const post = await databaseService.posts.findOne({ _id: result.insertedId })

        return post
    }

    async getAllPosts({
        user_id,
        page,
        limit,
        title,
        content,
        author,
        category,
        approved,
        my_posts
    }: {
        user_id: string
        page: number
        limit: number
        title?: string
        content?: string
        author?: string
        category?: PostCategory
        approved?: boolean
        my_posts?: boolean
    }) {
        const [{ posts, total_posts }] = await databaseService.posts
            .aggregate<{
                posts: Post[]
                total_posts: number
            }>([
                {
                    $match: {
                        ...(title ? { title: { $regex: title, $options: 'i' } } : {}),
                        ...(content ? { content: { $regex: content, $options: 'i' } } : {}),
                        ...(author ? { author: { $regex: author, $options: 'i' } } : {}),
                        ...(category ? { category } : {}),
                        ...(approved !== undefined ? { approved } : {}),
                        ...(my_posts ? { user_id: new ObjectId(user_id) } : {})
                    }
                },
                {
                    $facet: {
                        posts: [
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
                            ...this.commonAggregatePosts
                        ],
                        total: [
                            {
                                $count: 'total_posts'
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
                        posts: '$posts',
                        total_posts: '$total.total_posts'
                    }
                }
            ])
            .toArray()

        return {
            posts: posts || [],
            total_posts: total_posts || 0
        }
    }

    async updateApproveStatus(post_id: string, approved: boolean) {
        await databaseService.posts.updateOne(
            { _id: new ObjectId(post_id) },
            {
                $set: {
                    approved
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )

        return { message: POSTS_MESSAGES.UPDATE_APPROVE_STATUS_SUCCESSFULLY }
    }

    async updatePost(post_id: string, payload: UpdatePostReqBody) {
        await databaseService.posts.updateOne(
            {
                _id: new ObjectId(post_id)
            },
            {
                $set: payload,
                $currentDate: {
                    updated_at: true
                }
            }
        )

        const [post] = await databaseService.posts
            .aggregate<Post>([
                {
                    $match: {
                        _id: new ObjectId(post_id)
                    }
                },
                ...this.commonAggregatePosts
            ])
            .toArray()

        return post
    }

    async deletePost(post_id: string) {
        await databaseService.posts.deleteOne({
            _id: new ObjectId(post_id)
        })

        return { message: POSTS_MESSAGES.DELETE_POST_SUCCESSFULLY }
    }

    async getPost(slug: string) {
        const [post] = await databaseService.posts
            .aggregate<Post>([
                {
                    $match: {
                        slug
                    }
                },
                ...this.commonAggregatePosts
            ])
            .toArray()

        return post
    }
}

const postService = new PostService()

export default postService
