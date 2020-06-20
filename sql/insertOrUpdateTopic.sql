INSERT INTO topics(id, comment_count, created_at, deal_id, "url", reply_count, poll_id, video_id, vote_count)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (id)
DO UPDATE SET comment_count = $2, created_at = $3, deal_id = $4, "url" = $5, reply_count = $6, poll_id = $7, video_id = $8, vote_count = $9;