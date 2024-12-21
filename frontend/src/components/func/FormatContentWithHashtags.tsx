import { useNavigate } from "react-router-dom";

export const FormatContentWithHashtags = (text: string): (string | JSX.Element)[] => {
  const navigate = useNavigate();
  const hashtagRegex = /#[\w]+/g;

  const parts = text.split(hashtagRegex);

  const hashtags = [...text.matchAll(hashtagRegex)].map((match) => match[0]);

  const content: (string | JSX.Element)[] = [];
  parts.forEach((part, index) => {
    // Push non hashtag part
    content.push(part);
    // If hashtag exists at the same index, push a span
    if (hashtags[index]) {
      content.push(
        <span
          key={`hashtag-${index}`}
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => navigate(`/search?q=${hashtags[index].slice(1)}&p=latest`)}
        >
          {hashtags[index]}
        </span>
      );
    }
  });

  return content;
};
