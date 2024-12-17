import { FormatHashtag } from "../types/search.interface";

export const formatHashtag = (hashtag: any): FormatHashtag => ({
  hashtagId: hashtag._id.toString(),
  hashtag: hashtag.hashtag,
});