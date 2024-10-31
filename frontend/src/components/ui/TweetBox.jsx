import { useRef, useState } from "react";
import {
  BiCalendar,
  BiCurrentLocation,
  BiImageAdd,
  BiListOl,
  BiSmile,
  BiSolidFileGif,
} from "react-icons/bi";

const TweetBox = ({
  profilePictureUrl = "https://via.placeholder.com/150",
  onPost,
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    const textarea = textareaRef.current;
    setText(e.target.value);

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handlePost = () => {
    if (text.trim()) {
      onPost(text);

      setText("");
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.blur();
    }
  };

  return (
    <div className="border-b border-gray-600">
      <div className="flex flex-row p-3">
        {/* Profile Picture */}
        <div className="p-1 cursor-pointer h-fit w-14">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={profilePictureUrl}
            alt="User Profile"
          />
        </div>

        {/* Textarea and Icons */}
        <div className="flex flex-col w-full gap-3">
          <textarea
            ref={textareaRef}
            className="text-2xl text-white bg-black outline-none h-auto w-full resize-none"
            rows="1"
            value={text}
            onChange={handleTextChange}
            maxLength={256}
            placeholder="What is happeneing?!"
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              {/* Icons */}
              <div className="flex flex-row gap-3 cursor-pointer text-gray-400">
                <BiImageAdd className="hover:text-white" />
                <BiSolidFileGif className="hover:text-white" />
                <BiListOl className="hover:text-white" />
                <BiSmile className="hover:text-white" />
                <BiCalendar className="hover:text-white" />
                <BiCurrentLocation className="hover:text-white" />
              </div>

              {/* Post Button */}
              <button
                className={`${
                  text.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-400"
                } px-5 py-1 font-semibold rounded-full`}
                onClick={handlePost}
                disabled={!text.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
