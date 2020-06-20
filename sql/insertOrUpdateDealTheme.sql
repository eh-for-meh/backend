INSERT INTO deal_themes(accent_color, background_color, background_photo_url, deal_id, foreground)
VALUES($1, $2, $3, $4, $5)
ON CONFLICT (deal_id)
DO UPDATE SET accent_color = $1, background_color = $2, background_photo_url = $3, foreground = $5;