SELECT
  deals.created_at,
  deals.features,
  deals.id,
  deals.photo_urls as photos,
  deals.sold_out_at as "soldOutAt",
  deals.specifications,
  deals.title,
  deals.url,
  deal_themes.accent_color as "accentColor",
  deal_themes.background_color as "backgroundColor",
  deal_themes.background_photo_url as "backgroundImage",
  deal_themes.foreground as foreground,
  deal_stories.body as "storyBody",
  deal_stories.title as "storyTitle"
FROM deals
JOIN deal_themes ON deals.id = deal_themes.deal_id
JOIN deal_stories ON deals.id = deal_stories.deal_id
WHERE deals.id = $1;