const ForYouFollowing = ({ active }) => {
  return (
    <div className="hidden md:block">
      <div className="flex w-full h-14 border-b border-gray-600 relative">
        <div className="flex-1 flex items-center justify-center text-center relative cursor-pointer">
          For You
          {active === "for-you" && (
            <div className="w-20 h-1 bg-blue-500 rounded-full absolute bottom-0"></div>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center text-center relative cursor-pointer">
          Following
          {active === "following" && (
            <div className="w-20 h-1 bg-blue-500 rounded-full absolute bottom-0"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForYouFollowing;
