INSERT INTO deals(id, created_at, features, "url", maximum_purchase_count, minimum_purchase_count, photo_urls, sold_out_at, specifications, title)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
ON CONFLICT (id)
DO UPDATE SET features = $3, "url" = $4, maximum_purchase_count = $5, minimum_purchase_count = $6, photo_urls = $7, sold_out_at = $8, specifications = $9, title = $10;