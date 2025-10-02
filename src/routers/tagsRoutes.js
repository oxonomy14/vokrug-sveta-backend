// routes/tagsRoutes.js
import express from 'express';
import * as tagsController from '../controllers/tagsController.js';

const router = express.Router();

// GET /posts/:postId/tags → отримати теги поста
router.get('/posts/:postId/tags', tagsController.getTagsByPost);

// POST /posts/:postId/tags → додати тег до поста
router.post('/posts/:postId/tags', tagsController.addTagToPost);

// DELETE /posts/:postId/tags/:tagId → видалити тег
router.delete('/posts/:postId/tags/:tagId', tagsController.removeTagFromPost);

// GET /tags/:tagSlug/posts → отримати пости по тегу
router.get('/tags/:tagSlug/posts', tagsController.getPostsByTag);

export default router;
