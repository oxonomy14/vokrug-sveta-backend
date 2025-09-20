import { getDb } from '../db/initMySqlConnection.js';

// export const getAllPosts = async ({ limit, offset, sort, filters }) => {
//   const db = getDb();

//   let query = 'SELECT * FROM wp_posts';
//   const params = [];

//   // Додаємо фільтри
//   if (filters && filters.length > 0) {
//     const conditions = filters.map(f => `${f.field} ${f.operator} ?`).join(' AND ');
//     query += ` WHERE ${conditions}`;
//     filters.forEach(f => params.push(f.value));
//   }

//   // Додаємо сортування
//   if (sort) {
//     query += ` ORDER BY ${sort.field} ${sort.order}`;
//   }

//   // Додаємо пагінацію
//   if (limit) {
//     query += ' LIMIT ?';
//     params.push(Number(limit));
//     if (offset) {
//       query += ' OFFSET ?';
//       params.push(Number(offset));
//     }
//   }

//   const [rows] = await db.query(query, params);
//   return rows;
// };


export const getAllPosts = async ({ limit, offset, sort, filters } = {}) => {
  const db = getDb();

  let query = 'SELECT * FROM wp_posts';
  const params = [];

  // Фільтри
  if (filters && Array.isArray(filters) && filters.length > 0) {
    const conditions = filters.map(f => {
      // дозволяємо лише певні поля
      const allowedFields = ['title', 'author', 'category'];
      if (!allowedFields.includes(f.field)) return '1=1';
      return `${f.field} = ?`;
    }).join(' AND ');

    query += ` WHERE ${conditions}`;
    filters.forEach(f => params.push(f.value));
  }

  // Сортування
  if (sort && sort.field && sort.order) {
    const allowedFields = ['id', 'title', 'created_at'];
    const order = sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    if (allowedFields.includes(sort.field)) {
      query += ` ORDER BY ${sort.field} ${order}`;
    }
  }

  // Пагінація
  if (limit) {
    query += ' LIMIT ?';
    params.push(Number(limit));
    if (offset) {
      query += ' OFFSET ?';
      params.push(Number(offset));
    }
  }

  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error('❌ SQL error:', err);
    throw err; // контролер обробить
  }
};