import { Router } from 'express';
//import contactsRouter from './contacts.js';
//import authRouter from './auth.js';
import postsRouter from './posts.js';

const router = Router();

//router.use('/contacts', contactsRouter);
//router.use('/auth', authRouter);
//router.use('/blog', postRouter);
router.use('/posts', postsRouter);

export default router;