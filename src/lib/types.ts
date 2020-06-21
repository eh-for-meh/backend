export type Deal = {
  created_at?: string;
  features: string;
  id: string;
  items: DealItem[];
  launches?: DealLaunch[];
  photos: string[];
  purchaseQuantity?: {
    maximumLimit?: number;
    minimumLimit?: number;
  };
  soldOutAt?: string;
  specifications: string;
  story: DealStory;
  theme: DealTheme;
  title: string;
  topic: Topic;
  url: string;
};

export type DealItem = {
  attributes: Record<string, string>[];
  condition: "New" | "Refurbished";
  id: string;
  photo: string;
  price: number;
};

export type DealLaunch = {
  soldOutAt?: string;
};

export type DealTheme = {
  accentColor: string;
  backgroundColor: string;
  backgroundImage: string;
  foreground: "light" | "dark";
};

export type DealStory = {
  body: string;
  title: string;
};

export type MehAPIResponse = {
  deal: Deal;
  poll: Poll;
  video: Video;
};

export type Poll = {
  answers: PollAnswer[];
  id: string;
  startDate: string;
  title: string;
  topic: Topic;
};

export type PollAnswer = {
  id: string;
  text: string;
  voteCount: number;
};

export type Topic = {
  commentCount: number;
  createdAt: string;
  id: string;
  replyCount: number;
  url: string;
  voteCount: number;
};

export type Video = {
  id: string;
  startDate: string;
  title: string;
  url: string;
  topic: Topic;
};
