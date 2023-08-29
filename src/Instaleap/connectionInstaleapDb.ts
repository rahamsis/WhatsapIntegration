import {Pool} from 'pg';

const pool = new Pool({
  user: 'u_customer_order_support_rw',
  host: 'localhost',//'35.232.46.201', // o la dirección de tu servidor de PostgreSQL
  database: 'customer_order',
  password: 'password',
  port: 5434, // el puerto por defecto de PostgreSQL es 5432
});

export default pool;