import { useCallback, useEffect, useRef, useState } from "react";
import FloatingLabelInput from "../ui/FloatingLabelInput.jsx";
import { TbCameraPlus } from "react-icons/tb";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { fireapp } from "../../firebase.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../store/reducer/user.reducer.js";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();

  const [newDisplayName, setNewDisplayName] = useState(user.displayName);
  const [newBio, setNewBio] = useState(user.bio);
  const [image, setImage] = useState(null);
  // const [imageUploadProgress, setImageUploadProgress] = useState(null);

  const imageInputRef = useRef(null);

  const setUser = useCallback(() => {
    setNewDisplayName(user.displayName);
    setNewBio(user.bio);
    setImage(null);
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setUser();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, setUser]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleUploadImage = async (image) => {
    if (!image) throw new Error("Please select an image");
    const storage = getStorage(fireapp);
    const folderPath = "user/avatar";
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = `${folderPath}/${fileName}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        }
      );
    });
  };

  const updateUser = async () => {
    try {
      const newData = {
        ...(newDisplayName !== user.displayName && {
          displayName: newDisplayName,
        }),
        ...(newBio !== user.bio && { bio: newBio }),
        ...(image && { avatarUrl: await handleUploadImage(image) }),
      };

      const response = await axios.post("/api/user/update", newData);

      dispatch(signInSuccess(response.data));
      handleClearImage();
      onClose();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create post");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-blue-300 bg-opacity-30">
      <div className="relative bg-black rounded-2xl shadow-lg w-[40rem] h-[40rem] overflow-hidden">
        {/* Transparent black bar on top of modal */}
        <div className="absolute bg-black opacity-30 w-full h-14 z-40" />

        {/* Elements on top of bar */}
        <div className="absolute w-full z-50">
          {/* Close button */}
          <button className="absolute top-4 left-5 text-xl" onClick={onClose}>
            ✕
          </button>

          <div className="absolute top-4 left-16 text-xl font-bold">
            Edit Profile
          </div>

          <button
            className="absolute top-3 right-3 px-5 py-2 rounded-full font-bold bg-white hover:bg-gray-100 text-black"
            onClick={updateUser}
          >
            Save
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-full w-full overflow-y-scroll scrollbar-none">
          {/* Gap for top bar */}
          <div className="mb-20" />

          <div className="mx-6">
            <div className="mb-8">
              <div className="relative w-32 h-32 ">
                {image ? (
                  <div className="">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full overflow-hidden"
                    />
                    <button
                      className="absolute top-0 right-0 z-20"
                      onClick={handleClearImage}
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-800 hover:bg-gray-500">
                        ✕
                      </div>
                    </button>
                  </div>
                ) : (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 object-cover rounded-full overflow-hidden"
                  />
                )}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black bg-opacity-30 z-10 flex items-center justify-center">
                  <div
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-500 bg-opacity-50 hover:bg-opacity-50 rounded-full flex items-center justify-center"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <TbCameraPlus size={28} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={imageInputRef}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <FloatingLabelInput
                label="Name"
                type="text"
                value={newDisplayName}
                maxLength={50}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <FloatingLabelInput
                label="Bio"
                type="text"
                value={newBio}
                maxLength={160}
                onChange={(e) => setNewBio(e.target.value)}
                adjustableHeight={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;