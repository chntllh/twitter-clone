import { FormattedUser } from "../types/user.interface";

export const formatUser = (user: any): FormattedUser => ({
  userId: user._id,
  username: user.username,
  displayName: user.displayName,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  followersCount: user.followersCount,
  followingCount: user.followingCount,
  createdAt: user.createdAt,
});
