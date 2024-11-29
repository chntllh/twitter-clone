const ForYouFollowing = ({ activeTab, setActiveTab }) => {
  return (
    <div className="backdrop-blur-lg">
      <div className="flex w-full h-14 border-b border-gray-600 relative">
        <button
          key="for-you"
          className={`flex-1 py-4 text-center relative hover:bg-neutral-900 ${
            activeTab === "for-you" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("for-you")}
        >
          <span>For you</span>
          {activeTab === "for-you" && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-16 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button
          key="following"
          className={`flex-1 py-4 text-center relative hover:bg-neutral-900 ${
            activeTab === "following" ? "font-bold" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("following")}
        >
          <span>Following</span>
          {activeTab === "following" && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto w-16 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ForYouFollowing;
