import createHttpError from 'http-errors';
import { getAllPosts, getPostBySlug } from '../services/postsService.js';

// import { parsePaginationParams } from '../utils/parsePaginationParams.js';
// import { parseSortParams } from '../utils/parseSortParams.js';
// import { parseFilterParams } from '../utils/parseFilterParams.js';
// import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
// import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
// import { getEnvVar } from '../utils/getEnvVar.js';

export const getAllPostsController = async (req, res) => {
  try {
    const {
      lang = 'ru',
      category,
      author,
      sort,
      order,
      limit = 10,
      offset = 0,
    } = req.query;

    const filters = [];
    if (category) {
      filters.push({ field: 'category_slug', value: category });
    }
    if (author) {
      filters.push({ field: 'post_author', value: author });
    }

    const sortOptions =
      sort && order
        ? { field: sort, order }
        : { field: 'view_count', order: 'DESC' }; // дефолтне сортування

    const posts = await getAllPosts({
      lang,
      filters,
      sort: sortOptions,
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({ status: 200, data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch posts',
      data: { message: err.message },
    });
  }
};

// --- Отримати один пост по slug ---
export const getPostBySlugController = async (req, res) => {
   console.log('req.params:', req.params);
  try {
    const { slug } = req.params;
    const { lang } = req.query;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const post = await getPostBySlug({ slug, lang: lang || 'ru' });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error('❌ getPostBySlugController error:', err);
    res.status(500).json({ error: err.message });
  }
};