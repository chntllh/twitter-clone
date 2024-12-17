export interface FormattedTweet {
  tweetId: string;
  userId: string;
  avatarUrl?: string;
  displayName: string;
  username: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  retweetCount: number;
  createdAt: Date;
}
