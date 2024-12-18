import { FormattedTweet } from "../types/tweet.interface";

export const mergeTweetsAndRetweets = (
  tweets: FormattedTweet[],
  retweets: FormattedTweet[]
): FormattedTweet[] => {
  const merged: FormattedTweet[] = [];
  let i = 0,
    j = 0;

  while (i < tweets.length && j < retweets.length) {
    if (
      new Date(tweets[i].tweet.createdAt) >=
      new Date(retweets[j].retweeter!.retweetedAt)
    ) {
      merged.push(tweets[i]);
      i++;
    } else {
      merged.push(retweets[j]);
      j++;
    }
  }

  return [...merged, ...tweets.slice(i), ...retweets.slice(j)];
};
