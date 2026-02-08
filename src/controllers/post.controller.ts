import { Request, Response } from 'express';
import postService from '../services/post.service';
import User from '../models/user.model';


class PostController {
    // Create text-only post
    async createTextPost(req: any, res: Response) {
        try {
            const { content } = req.body;
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const userId = req.user?.id;
            // console.log('REQ ^^^^^', req)
            if (!content || !content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required'
                });
            }

            const post = await postService.createTextPost(userId, content);

            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                data: post
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Create post with single image
    async createImagePost(req: any, res: Response) {
        try {
            const { content } = req.body;
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const userId = req.user?.id;
            console.log('REQ ^^^^^^^^^^', req.file)
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'Image is required'
                });
            }

            const imageUrl = `/uploads/posts/${file.filename}`;
            const post = await postService.createImagePost(userId, content || '', imageUrl);

            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                data: post
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Create post with multiple images
    async createMultiImagePost(req: any, res: Response) {
        try {
            const { content } = req.body;
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const userId = req.user?.id;
            console.log('REQ ^^^^^^^^^^', req.files)
            const files = req.files;

            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'At least one image is required'
                });
            }

            const imageUrls = files.map((file: any) => `/uploads/posts/${file.filename}`);
            const post = await postService.createMultiImagePost(userId, content || '', imageUrls);

            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                data: post
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all posts (feed)
    async getPosts(req: any, res: Response) {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized User" });
                return;
            }

            const userId = req.user?.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const { posts, total } = await postService.getPosts(userId, page, limit);

            res.status(200).json({
                success: true,
                data: {
                    posts,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get single post
    async getPost(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const userId = req.user?.id!;

            const post = await postService.getPostById(postId, userId);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                data: post
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update post
    async updatePost(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const userId = req.user?.id!;
            const { content } = req.body;

            if (!content || !content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required'
                });
            }

            const updated = await postService.updatePost(postId, userId, content);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post updated successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete post
    async deletePost(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const userId = req.user?.id!;

            const deleted = await postService.deletePost(postId, userId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found or unauthorized'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Like post
    async likePost(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const userId = req.user?.id!;

            const liked = await postService.likePost(postId, userId);

            if (!liked) {
                return res.status(400).json({
                    success: false,
                    message: 'Post already liked'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post liked successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Unlike post
    async unlikePost(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.id);
            const userId = req.user?.id!;

            const unliked = await postService.unlikePost(postId, userId);

            if (!unliked) {
                return res.status(404).json({
                    success: false,
                    message: 'Like not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post unliked successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Comments
    async getComments(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const userId = req.user?.id!;

            if(!userId) {  
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized User'
                });
            }

            const result = await postService.getComments(postId, userId);

            res.status(200).json({
                success: true,
                message: 'Comments fetched successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add comment
    async addComment(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const { content, parent_comment_id } = req.body;
            const userId = req.user?.id!;

            const result = await postService.addComment(postId, userId, content, parent_comment_id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment added successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // React comment
    async reactComment(req: any, res: Response) {
        try {
            const commentId = parseInt(req.params.commentId);
            const userId = req.user?.id!;

            const result = await postService.reactComment(commentId, userId);

            res.status(200).json({
                success: true,
                message: result ? 'Like added successfully' : 'Like removed successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    // Edit comment
    async editComment(req: any, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const { commentId, content, parent_comment_id } = req.body;
            const userId = req.user?.id!;

            const result = await postService.editComment(postId, commentId,  userId, content, parent_comment_id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Something went wrong'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment added successfully',
                data: result
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new PostController();