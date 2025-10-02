import { getDb } from '../db/initMySqlConnection.js';

export const getTagsByPost = async ({ postTranslationId }) => {
  const db = getDb();

  const query = `
    SELECT t.id, t.name, t.slug
    FROM post_tags pt
    JOIN tags t ON pt.tag_id = t.id
    WHERE pt.post_translation_id = ?
  `;

  try {
    const [rows] = await db.query(query, [postTranslationId]);
    return rows;
  } catch (err) {
    console.error('❌ SQL error (getTagsByPost):', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};

export const addTagToPost = async ({ postTranslationId, tagId }) => {
  const db = getDb();

  const query = `
    INSERT INTO post_tags (post_translation_id, tag_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE post_translation_id = post_translation_id
  `;

  try {
    await db.query(query, [postTranslationId, tagId]);
    return { success: true };
  } catch (err) {
    console.error('❌ SQL error (addTagToPost):', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};


export const removeTagFromPost = async ({ postTranslationId, tagId }) => {
  const db = getDb();

  const query = `
    DELETE FROM post_tags
    WHERE post_translation_id = ? AND tag_id = ?
  `;

  try {
    await db.query(query, [postTranslationId, tagId]);
    return { success: true };
  } catch (err) {
    console.error('❌ SQL error (removeTagFromPost):', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};

export const getPostsByTag = async ({ tagSlug, lang = 'ru', limit = 10, offset = 0 }) => {
  const db = getDb();

  const query = `
    SELECT 
      pt.*,
      u.id AS author_id,
      ut.name AS author_name,
      ut.bio AS author_bio,
      ct.title AS category_title,
      ct.slug  AS category_slug,
      t.name AS tag_name,
      t.slug AS tag_slug
    FROM posts_translations pt
    JOIN posts p ON pt.post_id = p.id
    JOIN users u ON pt.post_author = u.id
    JOIN users_translations ut ON ut.user_id = u.id AND ut.lang = pt.lang
    LEFT JOIN categories c ON pt.category_id = c.id
    LEFT JOIN category_translations ct ON ct.category_id = c.id AND ct.lang = pt.lang
    JOIN post_tags ptg ON ptg.post_translation_id = pt.id
    JOIN tags t ON t.id = ptg.tag_id
    WHERE t.slug = ? AND pt.lang = ?
    ORDER BY pt.post_date DESC
    LIMIT ? OFFSET ?
  `;

  try {
    const [rows] = await db.query(query, [tagSlug, lang, limit, offset]);
    return rows;
  } catch (err) {
    console.error('❌ SQL error (getPostsByTag):', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};
