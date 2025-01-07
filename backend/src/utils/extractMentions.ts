export const extractMentions = (content: string): string[] => {
  const mentionRegex = /@\w+/g;
  const mentions = content.match(mentionRegex) || [];
  return [...new Set(mentions)];
};
