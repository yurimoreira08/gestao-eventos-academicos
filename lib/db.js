import { Pool } from 'pg';
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sportconnect',
  password: 'sua_senha_aqui',
  port: 5432,
});
export const query = (text, params) => pool.query(text, params);