import User from "../models/user.model";
import { UserFilter } from "../types/global";

export const fetchUser = async (filter: UserFilter) => {
  return await User.find(filter)
    .select("_id username displayName avatarUrl")
    .lean();
};
