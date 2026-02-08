// services/PostService.ts
import { Op, fn, col, literal, where } from 'sequelize';
import Post from '../models/posts.model';
import User from '../models/user.model';
import Like from '../models/likes.model';
import Comment from '../models/comments.model';
import CommentLike from '../models/commentLike.model';


class PostService {
    async createTextPost(userId: number, content: string): Promise<Post> {
        const post: any = await Post.create({ user_id: userId, content, type: 'text', created_at: new Date() });
        return await this.getPostById(post.id, userId) as Post;
    }

    async createImagePost(userId: number, content: string, imageUrl: string): Promise<Post> {
        const post: any = await Post.create({ user_id: userId, content, image_url: imageUrl, type: 'image', created_at: new Date() });
        return await this.getPostById(post.id, userId) as Post;
    }

    async createMultiImagePost(userId: number, content: string, images: string[]): Promise<Post> {
        const post: any = await Post.create({ user_id: userId, content, images: JSON.stringify(images), type: 'multi_image', created_at: new Date() });
        return await this.getPostById(post.id, userId) as Post;
    }

    async getPosts(userId: number, page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number }> {
        const offset = (page - 1) * limit;

        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'full_name', 'profile_picture'],
                    as: 'User'
                }
            ],
            attributes: [
                'id',
                'user_id',
                'content',
                'image_url',
                'created_at',
                [
                    literal(`(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id)`),
                    'likes_count'
                ],
                [
                    literal(`(SELECT COUNT(*) FROM comments WHERE comments.post_id = Post.id)`),
                    'comments_count'
                ],
                [
                    literal(`(SELECT COUNT(*) > 0 FROM likes WHERE likes.post_id = Post.id AND likes.user_id = ${userId})`),
                    'is_liked'
                ]
            ],
            order: [['created_at', 'DESC']],
            limit,
            offset,
            raw: false  // Important: keep as false to get model instances
        });

        const total = await Post.count();

        return { posts: posts as Post[], total };
    }

    async getPostById(postId: number, userId: number): Promise<Post | null> {
        const post = await Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'username', 'full_name', 'profile_picture'],
                    as: 'User'
                },
                { model: Like, attributes: [], as: 'Likes' },
                { model: Comment, attributes: [], as: 'Comments' }
            ],
            attributes: {
                include: [
                    [fn('COUNT', col('likes.id')), 'likes_count'],
                    [fn('COUNT', col('comments.id')), 'comments_count'],
                    [
                        literal(
                            `EXISTS(SELECT 1 FROM likes WHERE post_id = ${postId} AND user_id = ${userId})`
                        ),
                        'is_liked'
                    ]
                ]
            },
            group: ['Post.id', 'User.id']
        });

        return post;
    }

    async updatePost(postId: number, userId: number, content: string): Promise<boolean> {
        const [affectedRows] = await Post.update({ content }, { where: { id: postId, user_id: userId } });
        return affectedRows > 0;
    }

    async deletePost(postId: number, userId: number): Promise<boolean> {
        const deleted = await Post.destroy({ where: { id: postId, user_id: userId } });
        return deleted > 0;
    }

    async likePost(postId: number, userId: number): Promise<boolean> {
        const existing = await Like.findOne({ where: { post_id: postId, user_id: userId } });
        if (existing) return false;

        await Like.create({ post_id: postId, user_id: userId, created_at: new Date() });
        return true;
    }

    async unlikePost(postId: number, userId: number): Promise<boolean> {
        const deleted = await Like.destroy({ where: { post_id: postId, user_id: userId } });
        return deleted > 0;
    }

    async getComments(postId: number, userId: number) {
        const comments = await Comment.findAll({
            where: {
                post_id: postId,
                parent_comment_id: null  // Only top-level comments
            },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'profile_picture', 'is_verified']
                },
                {
                    model: Comment,
                    as: 'Replies',
                    include: [
                        {
                            model: User,
                            as: 'User',
                            attributes: ['id', 'username', 'profile_picture', 'is_verified'],
                        },
                        {
                            model: Comment,
                            as: 'Replies',
                            include: [
                                {
                                    model: User,
                                    as: 'User',
                                    attributes: ['id', 'username', 'profile_picture', 'is_verified']
                                }
                            ]
                        }
                    ],
                    attributes: [
                        'id',
                        'user_id',
                        'content',
                        'parent_comment_id',
                        'created_at',
                        [
                            literal(`(SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = Replies.id)`),
                            'likes_count'
                        ],
                        [
                            literal(`EXISTS(SELECT 1 FROM comment_likes WHERE comment_likes.comment_id = Replies.id AND comment_likes.user_id = ${userId})`),
                            'is_liked'
                        ]
                    ]
                }
            ],
            attributes: [
                'id',
                'user_id',
                'content',
                'parent_comment_id',
                'created_at',
                [
                    literal(`(SELECT COUNT(*) FROM comment_likes WHERE comment_likes.comment_id = Comment.id)`),
                    'likes_count'
                ],
                [
                    literal(`EXISTS(SELECT 1 FROM comment_likes WHERE comment_likes.comment_id = Comment.id AND comment_likes.user_id = ${userId})`),
                    'is_liked'
                ]
            ],
            subQuery: false,
            order: [['created_at', 'DESC']]
        });

        return comments;
    }

    // Add a new comment or reply
    async addComment(postId: number, userId: number, content: string, parentCommentId?: number) {
        // Verify post exists
        const postExists = await Post.findByPk(postId);
        if (!postExists) {
            throw new Error('Post not found');
        }

        // If replying to a comment, verify it exists
        if (parentCommentId) {
            const parentExists = await Comment.findByPk(parentCommentId);
            if (!parentExists) {
                throw new Error('Parent comment not found');
            }
        }

        const comment = await Comment.create({
            post_id: postId,
            user_id: userId,
            content,
            parent_comment_id: parentCommentId || null,
            created_at: new Date(),
        }) as any;

        // Increment comments count
        await Post.increment('comments_count', { where: { id: postId } });

        // Return comment with user data
        const commentWithUser = await Comment.findByPk(comment.id, {
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username', 'profile_picture', 'is_verified']
            }]
        });

        return commentWithUser;
    }

    // Like/Unlike a comment
    async reactComment(commentId: number, userId: number): Promise<boolean> {
        const existing = await CommentLike.findOne({
            where: { comment_id: commentId, user_id: userId }
        });

        // unlike
        if (existing) {
            // Unlike
            await existing.destroy();
            return false;
        }

        // Like
        await CommentLike.create({
            comment_id: commentId,
            user_id: userId,
            created_at: new Date()
        });
        return true;
    }

    // Edit/Modify Comment
    async editComment(postId: number, commentId: number, userId: number, content: string, parentCommentId?: number) {
        if (!content.trim()) {
            return false
        }
        const post = await Post.findByPk(postId);
        if (!post) {
            return false
        }
        const comment = await Comment.findOne({ where: { id: commentId, postId } })
        if (!comment) {
            return false
        }
        const updated = await comment.update({ content });
        return updated;
    }

    // Delete a comment
    async deleteComment(commentId: number, userId: number): Promise<boolean> {
        const deleted = await Comment.destroy({ where: { id: commentId, user_id: userId } });
        return deleted > 0;
    }
}

export default new PostService();