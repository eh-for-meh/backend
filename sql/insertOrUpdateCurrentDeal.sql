INSERT INTO deals(id, created_at, features, "url", photo_urls, sold_out_at, specifications, title)
VALUES($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (id)
DO UPDATE SET features = $3, "url" = $4, photo_urls = $5, sold_out_at = $6, specifications = $7, title = $8;