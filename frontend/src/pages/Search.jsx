import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState();

  useEffect(() => {
    setSearchQuery(searchParams.get("q"));
  }, [searchParams]);

  return (
    <div>
      <h1 className="text-2xl">{searchQuery}</h1>
    </div>
  );
};

export default Search;
