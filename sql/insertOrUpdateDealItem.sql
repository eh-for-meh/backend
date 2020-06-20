INSERT INTO deal_items(attributes, condition, id, deal_id, photo_url, price) VALUES($1, $2, $3, $4, $5, $6)
ON CONFLICT (id)
DO UPDATE SET attributes = $1, condition = $2, deal_id = $4, photo_url = $5, price = $6;