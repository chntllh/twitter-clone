import { useNavigate } from "react-router-dom";

export const FormatContentWithRegex = (text: string) => {
  const navigate = useNavigate();

  const combinedRegex = /#[\w]+|@[\w]+/g;

  const parts = text.split(combinedRegex);

  const matches = [...text.matchAll(combinedRegex)];

  const content: (string | JSX.Element)[] = [];

  parts.forEach((part, index) => {
    content.push(part);

    if (matches[index]) {
      const match = matches[index][0];

      if (match.startsWith("#")) {
        content.push(
          <span
            key={`hashtag-${index}`}
            className="text-blue-500 hover:underline"
            onClick={() => navigate(`/search?q=${match.slice(1)}&p=latest`)}
          >
            {match}
          </span>
        );
      } else if (match.startsWith("@")) {
        content.push(
          <span
            key={`mention-${index}`}
            className="text-blue-500 hover:underline"
            onClick={() => navigate(`/${match.slice(1)}`)}
          >
            {match}
          </span>
        );
      }
    }
  });

  return content;
};
