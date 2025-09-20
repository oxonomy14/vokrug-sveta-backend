import mysql from 'mysql2/promise';
import { getEnvVar } from '../utils/getEnvVar.js';

let pool;

export const initMySqlConnection = async () => {
  try {
    const host = getEnvVar('MYSQL_HOST', 'localhost');
    const user = getEnvVar('MYSQL_USER', 'root');
    const password = getEnvVar('MYSQL_PASSWORD', 'root');
    const database = getEnvVar('MYSQL_DB', 'vokrug_sveta_next_v2025');

    // створюємо пул підключень (краще, ніж одне підключення)
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // перевірка з’єднання
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log('✅ MySQL connection successfully established!');
    return pool;
  } catch (e) {
    console.error('❌ Error while setting up MySQL connection', e);
    process.exit(1);
  }
};

// експорт для використання в інших файлах
export const getDb = () => pool;
