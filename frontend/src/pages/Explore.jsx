import { useState } from "react";
import LabelledSelectorTabs from "../components/ui/LabelledSelectorTabs.jsx";
import ScrollTest from "../components/ui/ScrollTest.jsx";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("for-you");
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  const tabs = [
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

  const handleSearch = () => {
    if (!search || search === "") return;
    navigate(`/search?q=${search}`);
  };

  return (
    <div>
      <div className="sticky top-0 pt-2 z-10 backdrop-blur-lg bg-black bg-opacity-30">
        <div className="flex justify-center mb-2">
          <div
            className={`flex relative w-[90%] h-12 overflow-hidden rounded-full border border-gray-600 ${
              isFocused && "ring-2 ring-blue-500"
            }`}
          >
            <div
              onClick={handleSearch}
              className={`absolute py-2 px-4 z-10 rounded-full hover:bg-gray-300 hover:bg-opacity-30 hover:cursor-pointer ${
                isFocused && "text-blue-500"
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
              className="w-full pl-20 pr-2 text-2xl bg-transparent outline-none"
            />
          </div>
        </div>

        <LabelledSelectorTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <ScrollTest />
    </div>
  );
};

export default Explore;
