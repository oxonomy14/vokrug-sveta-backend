// controllers/tagsController.js
import * as tagsService from '../services/tagsService.js';

// ✅ Отримати теги для конкретного поста
export const getTagsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const tags = await tagsService.getTagsByPost({ postTranslationId: postId });
    res.json(tags);
  } catch (err) {
    console.error('❌ Controller error (getTagsByPost):', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Додати тег до поста
export const addTagToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { tagId } = req.body;

    await tagsService.addTagToPost({ postTranslationId: postId, tagId });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Controller error (addTagToPost):', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Видалити тег з поста
export const removeTagFromPost = async (req, res) => {
  try {
    const { postId, tagId } = req.params;

    await tagsService.removeTagFromPost({ postTranslationId: postId, tagId });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Controller error (removeTagFromPost):', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Отримати пости по тегу
export const getPostsByTag = async (req, res) => {
  try {
    const { tagSlug } = req.params;
    const { lang = 'ru', limit = 10, offset = 0 } = req.query;

    const posts = await tagsService.getPostsByTag({ 
      tagSlug, 
      lang, 
      limit: Number(limit), 
      offset: Number(offset) 
    });

    res.json(posts);
  } catch (err) {
    console.error('❌ Controller error (getPostsByTag):', err);
    res.status(500).json({ error: err.message });
  }
};
