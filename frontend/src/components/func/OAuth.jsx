import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fireapp } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess } from "../../redux/user/userSlice.js";

const OAuth = () => {
  const auth = getAuth(fireapp);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error))
    }
  };

  return (
    <button
      className="w-full px-5 py-2 mb-4 flex items-center justify-center gap-1 bg-white hover:bg-gray-200 text-gray-800 font-bold rounded-full"
      onClick={handleGoogleClick}
    >
      <FcGoogle size={24} />
      <span>Sign in with Google</span>
    </button>
  );
};

export default OAuth;
