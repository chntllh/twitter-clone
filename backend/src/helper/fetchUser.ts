import User from "../models/user.model";

export const fetchUser = async (filter) => {
  return await User.find(filter)
    .select("_id username displayName avatarUrl")
    .lean();
};
