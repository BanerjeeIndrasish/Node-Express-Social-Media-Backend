// routes/post.routes.ts
import { Router } from 'express';
import postController from '../controllers/post.controller';
import { protect } from '../middlewares/auth';
import UploadMiddleware from '../middlewares/upload';

const router = Router();

router.use(protect);

router.post('/text', postController.createTextPost);

router.post(
    '/image',
    UploadMiddleware.handleSingleUpload,
    postController.createImagePost
);

router.post(
    '/multi-image',
    UploadMiddleware.handleMultipleUpload,
    postController.createMultiImagePost
);

router.get('/', postController.getPosts);

router.get('/:id', postController.getPost);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);

router.post('/:postId/like', postController.likePost);

router.delete('/:id/unlike', postController.unlikePost);

router.get('/:postId/comments', postController.getComments);

router.post('/:postId/comment', postController.addComment);

router.post('/:postId/comment', postController.editComment);

router.post('/:commentId/react-comment', postController.reactComment);

export default router;