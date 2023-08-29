import pool from "./connectionInstaleapDb";

export async function instaleapReport() {
    let client;
  try {
    client = await pool.connect();
    const query = `
    SELECT DISTINCT sn.order_ean_code, sn.created_at, d.start_date_delivery_window, d.end_date_delivery_window
    FROM sale_note sn
    INNER JOIN sale_note_item sni ON sni.sale_note_id = sn.sale_note_id
    INNER JOIN dispatch AS d ON d.dispatch_id = sni.dispatch_id
    WHERE sn.order_ean_code LIKE $1
      AND DATE_TRUNC('DAY', sn.created_at) >= current_date - 3
      AND sn.order_ean_code NOT IN (
        SELECT order_number FROM instaleap_order
        WHERE DATE_TRUNC('DAY', created_at) >= current_date - 3
      )
  `;
    const result = await client.query(query, ['219%']);
    return result.rows;
  } catch (err) {
    console.error('Error fetching data:', err);
    throw err;
  } finally {
    if(client){
        client.release();
    }
  }
}