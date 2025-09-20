import createHttpError from 'http-errors';
import { getAllPosts} from '../services/posts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';



// export const getAllPostsController = async (req, res, next) => {
//   try {
//     const { limit, offset } = parsePaginationParams(req.query);
//     const sort = parseSortParams(req.query);
//     const filters = parseFilterParams(req.query);

//     const posts = await getAllPosts({ limit, offset, sort, filters });

//     res.json({
//       data: posts,
//       pagination: { limit, offset, count: posts.length },
//     });
//   } catch (err) {
//     console.error('❌ Controller error:', err);
//     next(createHttpError(500, 'Failed to fetch posts'));
//   }
// };
  
// export const getAllPostsController = async (req, res, next) => {
//   try {
//     const posts = await getAllPosts({});
//     res.json(posts);
//   } catch (err) {
//     console.error('❌ DB error in getAllPostsController:', err); // <- додаємо лог
//     next(createHttpError(500, 'Failed to fetch posts'));
//   }
// };

export const getAllPostsController = async (req, res, next) => {
  try {
    // Парсинг параметрів з query
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const sort = req.query.sortField ? { field: req.query.sortField, order: req.query.sortOrder || 'ASC' } : null;

    const filters = req.query.filters ? JSON.parse(req.query.filters) : [];

    const posts = await getAllPosts({ limit, offset, sort, filters });

    res.json({
      data: posts,
      pagination: { limit, offset, count: posts.length },
    });
  } catch (err) {
    console.error('❌ Controller error:', err);
    next(createHttpError(500, 'Failed to fetch posts'));
  }
};