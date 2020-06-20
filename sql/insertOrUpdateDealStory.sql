INSERT INTO deal_stories(deal_id, body, title)
VALUES($1, $2, $3)
ON CONFLICT (deal_id)
DO UPDATE SET body = $2, title = $3;