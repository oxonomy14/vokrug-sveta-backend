import { Router } from 'express';
//import contactsRouter from './contacts.js';
//import authRouter from './auth.js';
import postsRouter from './postsRoutes.js';
import tagsRoutes from './tagsRoutes.js';

const router = Router();

//router.use('/contacts', contactsRouter);
//router.use('/auth', authRouter);
//router.use('/blog', postRouter);
router.use('/posts', postsRouter);
router.use('/api', tagsRoutes);

export default router;