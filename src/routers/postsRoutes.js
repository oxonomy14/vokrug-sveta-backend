
import { getAllPostsController, getPostBySlugController} from "../controllers/postsController.js";
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import { isValidId } from '../middlewares/isValidId.js';
// import { validateBody } from '../middlewares/validateBody.js';
// import { createContactSchema } from '../validation/contacts.js';
// import { updateContactSchema } from '../validation/contacts.js';
// import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

//router.use(authenticate);

// GET /posts?limit=10&offset=0&lang=ru
router.get('/', ctrlWrapper(getAllPostsController));


// GET /posts/:slug?lang=ru
router.get('/slug/:slug', ctrlWrapper(getPostBySlugController));




//router.use('/:contactId', isValidId('contactId')); // більшь гнучка, можеме змнінювати змінну contactId


//router.get('/:contactId', ctrlWrapper(getContactByIdController)); 
//router.delete('/:contactId', ctrlWrapper(deleteContactController)); 
//router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContactController));  
//router.patch('/:contactId',  upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContactController));





export default router;