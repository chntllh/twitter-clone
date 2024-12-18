export interface FormattedTweet {
  tweet: {
    tweetId: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    retweetCount: number;
    createdAt: Date;
  };
  user: {
    userId: string;
    avatarUrl?: string;
    displayName: string;
    username: string;
  };
  retweeter?: {
    retweetId: string;
    userId: string;
    avatarUrl?: string;
    displayName: string;
    username: string;
    retweetedAt: Date;
  };
}
