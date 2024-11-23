const tabs = ["Tweets", "Replies", "Media", "Likes"];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-600">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`flex-1 py-4 text-center relative hover:bg-neutral-900 ${
            activeTab === tab ? "font-bold" : "text-gray-500"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-16 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
