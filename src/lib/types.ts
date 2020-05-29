export type Deal = {
  features: string;
  id: string;
  items: DealItem[];
  launches: DealLaunch[];
  photos: string[];
  purchaseQuantity?: {
    maximumLimit?: number;
    minimumLimit?: number;
  };
  soldOutAt?: Date;
  specifications: string;
  story: DealStory;
  theme: DealTheme;
  title: string;
  topic: Topic;
  url: string;
};

export type DealItem = {
  condition: "New" | "Refurbished";
  id: string;
};

export type DealLaunch = {
  soldOutAt?: Date;
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
  startDate: Date;
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
  createdAt: Date;
  id: string;
  replyCount: number;
  url: string;
  voteCount: number;
};

export type Video = {
  id: string;
  startDate: Date;
  title: string;
  url: string;
  topic: Topic;
};