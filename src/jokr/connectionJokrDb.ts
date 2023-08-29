import { Pool } from 'pg';

const pool = new Pool({
  user: 'u_picking_support_rw',
  host: 'localhost',//'104.197.38.103', // o la dirección de tu servidor de PostgreSQL
  database: 'picking',
  password: 'password',
  port: 5438, // el puerto por defecto de PostgreSQL es 5432
});

export default pool;