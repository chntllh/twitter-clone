import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure } from "../../redux/user/userSlice.js";

const ErrorPopup = () => {
  const dispatch = useDispatch()
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    if(error) {
      const timer = setTimeout(() => dispatch(signInFailure(null)), 10000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  if (!error) {
    return null;
  }

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
      <span>{error}</span>
    </div>
  );
};

export default ErrorPopup;
