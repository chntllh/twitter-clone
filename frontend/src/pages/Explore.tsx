import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs";
import { useLocation, useNavigate } from "react-router-dom";
// import ScrollTest from "../components/ui/ScrollTest";
import { getHashtagTweets } from "../api/api";
import Posts from "../components/ui/Post/Posts";

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isFocused, setIsFocused] = useState(false);

  const [search, setSearch] = useState<string>("");
  const [query, setQuery] = useState<string>("");

  const [activeExploreTab, setActiveExploreTab] = useState("for-you");
  const [activeSearchTab, setActiveSearchTab] = useState("latest");

  const [searchPosts, setSearchPosts] = useState<Tweet[]>([]);

  const exploreTab: LabelledSelectorTab[] = [
    {
      tab: "for-you",
      tabName: "For You",
    },
    {
      tab: "trending",
      tabName: "Trending",
    },
    {
      tab: "news",
      tabName: "News",
    },
    {
      tab: "sport",
      tabName: "Sport",
    },
    {
      tab: "entertainment",
      tabName: "Entertainment",
    },
  ];

  const searchTabs: LabelledSelectorTab[] = [
    {
      tab: "top",
      tabName: "Top",
    },
    {
      tab: "latest",
      tabName: "Latest",
    },
    {
      tab: "people",
      tabName: "People",
    },
    {
      tab: "media",
      tabName: "Media",
    },
    {
      tab: "lists",
      tabName: "Lists",
    },
  ];

  useEffect(() => {
    if (location.pathname === "/search") {
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get("q");
      const searchType = searchParams.get("p");
      setSearch(searchQuery || "");
      setQuery(searchQuery || "");
      setActiveSearchTab(searchType || "latest");
    }
  }, [location, location.search]);

  useEffect(() => {
    if (query) {
      getHashtagTweets(query)
        .then((res) => {
          setSearchPosts(res.data as Tweet[]);
        })
        .catch((error) => {
          setSearchPosts([]);
          console.error("Error fetching posts: ", error);
        });
    }
  }, [query]);

  const handleSearch = () => {
    if (!search || search === "") return;
    navigate(`/search?q=${search}&p=${activeSearchTab}`);
  };

  return (
    <div>
      <div className="sticky top-0 pt-2 z-10 backdrop-blur-lg bg-black bg-opacity-30">
        <div className="flex justify-center mb-2">
          <div
            className={`flex relative w-[90%] h-12 overflow-hidden rounded-full border border-gray-600 ${isFocused && "ring-2 ring-blue-500"
              }`}
          >
            <div
              onClick={handleSearch}
              className={`absolute py-2 px-4 z-10 rounded-full hover:bg-gray-300 hover:bg-opacity-30 hover:cursor-pointer ${isFocused && "text-blue-500"
                }`}
            >
              <BiSearch size={30} />
            </div>
            <input
              type="text"
              value={search}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full pl-16 pr-2 text-2xl bg-transparent outline-none"
            />
          </div>
        </div>

        {location.pathname === "/explore" && (
          <LabelledSelectorTabs
            tabs={exploreTab}
            activeTab={activeExploreTab}
            setActiveTab={setActiveExploreTab}
          />
        )}

        {location.pathname === "/search" && (
          <LabelledSelectorTabs
            tabs={searchTabs}
            activeTab={activeSearchTab}
            setActiveTab={(tab) => {
              navigate(`/search?q=${search}&p=${tab}`);
            }}
          />
        )}
      </div>

      {/* {location.pathname === "/explore" && <ScrollTest />} */}

      {location.pathname === "/search" &&
        (searchPosts.length > 0 ? (
          <Posts posts={searchPosts} />
        ) : (
          <div className="p-3 mt-20">
            <h1 className="text-4xl text-center">No posts found</h1>
          </div>
        ))}
    </div>
  );
};

export default Explore;
