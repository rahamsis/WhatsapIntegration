import pool from "./connectionJokrDb";

export async function jokrReport() {
    let client;
  try {
    client = await pool.connect();
    const query = `
    select od.created_at,sod.state_order_dispatch_id,sod."name",order_number,op.picker_id,op.lot_id,od.order_dispatch_id, od.entity_id
    from order_dispatch od 
    left join state_order_dispatch sod on sod.state_order_dispatch_id = od.state_order_dispatch_id
    left join order_picking op on op.order_dispatch_id = od.order_dispatch_id 
    where sale_entity like $1 and od.state_order_dispatch_id not in(9,10) 
    and op.picker_id is not null
    group by 1,2,3,4,5,6,7,8
    order by sod.state_order_dispatch_id,od.created_at desc;
  `;
    const result = await client.query(query, ['%JKR%']);
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