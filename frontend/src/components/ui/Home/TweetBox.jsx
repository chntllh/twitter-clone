import { useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  BiCalendar,
  BiCurrentLocation,
  BiImageAdd,
  BiListOl,
  BiSmile,
  BiSolidFileGif,
} from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { fireapp } from "../../../firebase.js";
import { postTweet } from "../../../api/api.js";

const TweetBox = ({ profilePictureUrl, onPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [error, setError] = useState(null);

  const textAreaRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleTextChange = (e) => {
    const textarea = textAreaRef.current;
    setText(e.target.value);
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleUploadImage = async () => {
    if (!image) throw new Error("Please select an image");
    const storage = getStorage(fireapp);
    const filename = `${Date.now()}-${image.name}`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageUploadProgress(
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
          );
        },
        (error) => {
          setImageUploadProgress(null);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          resolve(downloadUrl);
        }
      );
    });
  };

  const handlePost = async () => {
    if (!text.trim() && !image) {
      setError("Cannot post empty content!");
      return;
    }

    setError(null);

    let uploadedImageUrl = "";
    if (image) {
      uploadedImageUrl = await handleUploadImage();
    }

    postTweet({
      content: text,
      imageUrl: uploadedImageUrl,
    })
      .then((res) => {
        onPost(res.data);
        resetState();
      })
      .catch((error) => {
        console.error("Error posting tweet:", error);
        setError("Failed to post tweet.");
      });
  };

  const resetState = () => {
    setText("");
    setImage(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.blur();
  };

  return (
    <div className="border-b border-gray-600">
      <div className="flex flex-row p-3">
        {/* Profile Picture */}
        <div className="p-1 mr-2 cursor-pointer h-fit w-14">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={profilePictureUrl}
            alt="User Profile"
          />
        </div>

        {/* Textarea and Icons */}
        <div className="flex flex-col w-full gap-3">
          <textarea
            ref={textAreaRef}
            className="text-2xl text-white bg-black outline-none h-auto w-full resize-none"
            rows="1"
            value={text}
            onChange={handleTextChange}
            maxLength={256}
            placeholder="What is happening?!"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mx-auto">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 rounded-md object-cover"
              />
              <button
                onClick={handleClearImage}
                className="absolute top-1 right-1 bg-black hover:bg-gray-800 bg-opacity-50 text-white rounded-full p-1"
              >
                <MdClose />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              {/* Icons */}
              <div className="flex flex-row gap-3 text-gray-400">
                <div
                  className="hover:text-white cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <BiImageAdd size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                  />
                </div>
                <div className="hover:text-white cursor-pointer">
                  <BiSolidFileGif size={20} />
                </div>
                <div className="hover:text-white cursor-pointer">
                  <BiListOl size={20} />
                </div>
                <div className="hover:text-white cursor-pointer">
                  <BiSmile size={20} />
                </div>
                <div className="hover:text-white cursor-pointer">
                  <BiCalendar size={20} />
                </div>
                <div className="hover:text-white cursor-pointer">
                  <BiCurrentLocation size={20} />
                </div>
              </div>

              {/* Post Button */}
              <button
                className={`${
                  text.trim() || image
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-400 cursor-not-allowed"
                } px-5 py-1 font-semibold rounded-full`}
                onClick={handlePost}
                disabled={!text.trim() && !image}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-xl text-center mb-2 mx-6 bg-blue-500 rounded-lg">
          {error}
        </div>
      )}
      {imageUploadProgress && (
        <div className="w-64 mx-auto bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${imageUploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TweetBox;
