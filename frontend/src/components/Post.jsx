import {
  HiArrowPathRoundedSquare,
  HiEllipsisHorizontal,
  HiMiniArrowUpTray,
  HiOutlineBars3CenterLeft,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHeart,
} from "react-icons/hi2";

export default function Post() {
  return (
    <div className="flex p-4 border-b border-gray-600">
      <div className="w-14 cursor-pointer">
        <img
          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-md"
          src="https://e1.pxfuel.com/desktop-wallpaper/708/299/desktop-wallpaper-wwe-randy-orton-weneedfun-randy-orton-2019-thumbnail.jpg"
          alt="Profile Picture"
        />
      </div>
      <div className="w-full px-2">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <h1 className="font-medium hover:underline cursor-pointer">
              Randy Orton
            </h1>
            <h1 className="font-light text-gray-300">@CivilwaRKO · Feb 30</h1>
          </div>
          <HiEllipsisHorizontal className="text-2xl cursor-pointer" />
        </div>
        <div className="">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem
            repellendus at inventore quos consequuntur minus eligendi qui facere
            enim accusantium, architecto suscipit. Ea, temporibus ut.
          </p>
        </div>
        <div className="cursor-pointer">
          <img
            className="max-h-[300px] max-w-full object-cover mx-auto border-2 border-gray-300 rounded-2xl"
            src="https://wallpapers.com/images/featured/dragon-ball-super-pictures-6s9gnffpcvuar9c4.jpg"
            alt="Post"
          />
        </div>
        <div className="w-full flex pt-3 justify-between items-center text-xl text-gray-400">
          <div className="flex items-center gap-1">
            <HiOutlineChatBubbleOvalLeft />
            <div className="text-sm">10</div>
          </div>
          <div className="flex items-center gap-1">
            <HiArrowPathRoundedSquare />
            <div className="text-sm">10</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineHeart />
            <div className="text-sm">10</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBars3CenterLeft />
            <div className="text-sm">10</div>
          </div>
          <div className="flex items-center gap-1">
            <HiOutlineBookmark />
            <HiMiniArrowUpTray />
          </div>
        </div>
      </div>
    </div>
  );
}
