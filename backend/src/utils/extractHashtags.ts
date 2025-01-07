export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#\w+/g;
  const hashtags = content.match(hashtagRegex) || [];
  return [...new Set(hashtags.map((tag) => tag.toLowerCase()))];
};
