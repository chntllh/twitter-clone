import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fireapp } from "../../firebase.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../store/reducer/user.reducer.js";
import { googleLogin } from "../../api/api.js";

const OAuth = () => {
  const auth = getAuth(fireapp);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    dispatch(signInStart());

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const resultsFromGoogle = await signInWithPopup(auth, provider);

    await googleLogin(resultsFromGoogle)
      .then((res) => {
        dispatch(signInSuccess(res.data));
        navigate("/");
      })
      .catch((error) => {
        dispatch(signInFailure(error.response.data.message));
      });
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
