import { getDb } from '../db/initMySqlConnection.js';

export const getAllPosts = async ({
  limit = 10,
  offset = 0,
  sort = null,
  filters = [],
  lang = 'ru'
} = {}) => {
  const db = getDb();

  let query = `
    SELECT 
      pt.*,
      u.id AS author_id,
      ut.name AS author_name,
      ut.bio AS author_bio,
      ct.title AS category_title,
      ct.slug  AS category_slug
    FROM posts_translations pt
    JOIN posts p ON pt.post_id = p.id
    JOIN users u ON pt.post_author = u.id
    JOIN users_translations ut ON ut.user_id = u.id AND ut.lang = pt.lang
    LEFT JOIN categories c ON pt.category_id = c.id
    LEFT JOIN category_translations ct 
      ON ct.category_id = c.id AND ct.lang = pt.lang
  `;

  const params = [];

  // --- Фільтри ---
  if (filters.length > 0) {
    const conditions = filters.map(f => {
      const allowedPostFields = ['title', 'slug', 'post_status', 'post_author'];
      const allowedCategoryFields = ['category_slug', 'category_title'];

      if (allowedPostFields.includes(f.field)) return `pt.${f.field} = ?`;
      if (allowedCategoryFields.includes(f.field)) {
        const map = { category_slug: 'ct.slug', category_title: 'ct.title' };
        return `${map[f.field]} = ?`;
      }
      return '1=1';
    }).join(' AND ');

    query += ` WHERE ${conditions}`;
    filters.forEach(f => params.push(f.value));
  }

  // --- Фільтр по мові ---
  query += filters.length > 0 ? ' AND' : ' WHERE';
  query += ' pt.lang = ?';
  params.push(lang);

  // --- Сортування ---
  if (sort && sort.field && sort.order) {
    const allowedSortFields = ['post_id', 'title', 'post_date', 'view_count'];
    const order = sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    if (allowedSortFields.includes(sort.field)) {
      query += ` ORDER BY pt.${sort.field} ${order}`;
    }
  } else {
    query += ' ORDER BY pt.post_date DESC';
  }

  // --- Пагінація ---
  query += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  try {
    console.log('SQL Query:', query);
    console.log('Params:', params);

    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error('❌ SQL error:', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};


export const getPostBySlug = async ({ slug, lang = 'ru' }) => {
  const db = getDb();

  let query = `
    SELECT 
      pt.*,
      u.id AS author_id,
      ut.name AS author_name,
      ut.bio AS author_bio,
      ct.title AS category_title,
      ct.slug  AS category_slug
    FROM posts_translations pt
    JOIN posts p ON pt.post_id = p.id
    JOIN users u ON pt.post_author = u.id
    JOIN users_translations ut ON ut.user_id = u.id AND ut.lang = pt.lang
    LEFT JOIN categories c ON pt.category_id = c.id
    LEFT JOIN category_translations ct 
      ON ct.category_id = c.id AND ct.lang = pt.lang
    WHERE pt.slug = ? AND pt.lang = ?
    LIMIT 1
  `;

  try {
    let [rows] = await db.query(query, [slug, lang]);

    if (rows.length === 0 && lang !== 'ru') {
      console.log('Fallback to Russian version');
      [rows] = await db.query(query, [slug, 'ru']); // fallback на російську
    }

    return rows[0] || null;
  } catch (err) {
    console.error('❌ SQL error:', err);
    throw new Error(`SQL failed: ${err.message}`);
  }
};