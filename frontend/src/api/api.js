import apiClient from "./apiClient.js";

export const testUser = () => apiClient.get("/api/user/test");

// Authentication
export const login = (identifier, password) => {
  return apiClient.post("/api/auth/login", {
    identifier,
    password,
  });
};

export const signup = (email, name, password) => {
  return apiClient.post("/api/auth/register", {
    email,
    name,
    password,
  });
};

export const googleLogin = ({ user }) => {
  return apiClient.post("/api/auth/google", {
    name: user.displayName,
    email: user.email,
    googlePhotoUrl: user.photoURL,
  });
};

// User
export const updateUser = (newData) => {
  return apiClient.post("/api/user/update", newData);
};

export const getUser = (userId) => {
  return apiClient.get(`/api/user/${userId}`);
};

export const follow = (userId) => {
  return apiClient.post(`/api/user/${userId}/follow`);
};

export const unfollow = (userId) => {
  return apiClient.post(`/api/user/${userId}/unfollow`);
};

export const getFollowers = (userId) => {
  return apiClient.get(`/api/user/${userId}/followers`);
};

export const getFollowing = (userId) => {
  return apiClient.get(`/api/user/${userId}/following`);
};

export const getIsFollowing = (userId) => {
  return apiClient.get(`/api/user/${userId}/is-following`);
};

export const getUserTweets = (userId) => {
  return apiClient.get(`/api/user/${userId}/usertweets`);
};

// Combined request for hovercards
export const getUserAndIsFollowing = async (userId) => {
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
export const postTweet = (postData) => {
  return apiClient.post("/api/tweet", postData);
};

export const getAllTweets = () => {
  return apiClient.get("/api/tweet/all");
};

export const getUserFollowingTweets = (userId) => {
  return apiClient.get(`/api/user/${userId}/followingtweets`);
};
