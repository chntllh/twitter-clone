import { User } from "firebase/auth";
import apiClient from "./apiClient";

export const testUser = () => apiClient.get("/api/user/test");

// Authentication
export const login = (identifier: string, password: string) => {
  return apiClient.post("/api/auth/login", {
    identifier,
    password,
  });
};

export const preLogin = (identifier: string) => {
  return apiClient.post("/api/auth/prelogin", { identifier });
};

export const preRegister = (email: string, name: string) => {
  return apiClient.post("/api/auth/preregister", { email, name });
};

export const signup = (email: string, name: string, password: string) => {
  return apiClient.post("/api/auth/register", {
    email,
    name,
    password,
  });
};

export const googleLogin = ({ user }: { user: User }) => {
  return apiClient.post<AppUser>("/api/auth/google", {
    name: user.displayName,
    email: user.email,
    googlePhotoUrl: user.photoURL,
  });
};

// User
type ExtendedNewData = Partial<AppUser> &
  Partial<{
    password: string;
    newPassword: string;
  }>;

export const updateUser = (newData: ExtendedNewData) => {
  return apiClient.post("/api/user/update", newData);
};

export const getUser = (userId: string) => {
  return apiClient.get<AppUser>(`/api/user/${userId}`);
};

export const follow = (userId: string) => {
  return apiClient.post(`/api/user/${userId}/follow`);
};

export const unfollow = (userId: string) => {
  return apiClient.post(`/api/user/${userId}/unfollow`);
};

export const getFollowers = (userId: string) => {
  return apiClient.get<AppUser[]>(`/api/user/${userId}/followers`);
};

export const getFollowing = (userId: string) => {
  return apiClient.get<AppUser[]>(`/api/user/${userId}/following`);
};

export const getIsFollowing = (userId: string) => {
  return apiClient.get<boolean>(`/api/user/${userId}/is-following`);
};

export const getUserTweets = (userId: string) => {
  return apiClient.get(`/api/user/${userId}/usertweets`);
};

// Combined request for hovercards
type GetUserAndIsFollowingResponse = {
  user: AppUser;
  isFollowing: boolean;
};

export const getUserAndIsFollowing = async (
  userId: string
): Promise<GetUserAndIsFollowingResponse> => {
  const [userRes, isFollowRes] = await Promise.all([
    getUser(userId),
    getIsFollowing(userId),
  ]);
  return {
    user: userRes.data,
    isFollowing: isFollowRes.data,
  };
};

// Tweet
export const postTweet = (postData: Partial<Post>) => {
  return apiClient.post("/api/tweet", postData);
};

export const getAllTweets = () => {
  return apiClient.get<Tweet[]>("/api/tweet/all");
};

export const getUserFollowingTweets = (userId: string) => {
  return apiClient.get<Tweet[]>(`/api/user/${userId}/followingtweets`);
};

export const likeTweet = (tweetId: string) => {
  return apiClient.post(`/api/tweet/${tweetId}/like`);
};

export const unlikeTweet = (tweetId: string) => {
  return apiClient.post(`/api/tweet/${tweetId}/unlike`);
};

export const retweetTweet = (tweetId: string) => {
  return apiClient.post(`/api/tweet/${tweetId}/retweet`);
};

export const unretweetTweet = (tweetId: string) => {
  return apiClient.post(`/api/tweet/${tweetId}/unretweet`);
};

// Search
export const getHashtagTweets = (hashtag: string) => {
  return apiClient.get<Tweet[]>(`/api/search/hashtagtweets/${hashtag}`);
};

// Notifications
export const getUserNotifications = () => {
  return apiClient.get<Tweet[]>("/api/search/notifications/mentions");
};
