import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Modal from "../ui/Modal";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import OAuth from "./OAuth.jsx";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const SignInModal = ({ isOpen, onClose, onSignUpOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isIdentifierEntered, setIsIdentifierEntered] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  const handlePasswordShowToggle = () => {
    passwordFieldType === "password"
      ? setPasswordFieldType("text")
      : setPasswordFieldType("password");
  };

  const handleCloseModal = () => {
    setIsIdentifierEntered(false);
    setIdentifier("");
    setPassword("");
    setPasswordFieldType("password");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <div className="flex flex-col items-center">
        {!isIdentifierEntered ? (
          <div className="w-[20rem]">
            <h1 className="text-4xl font-bold mb-8">Sign in to Twixxer</h1>

            <OAuth />

            <div className="flex items-center gap-4 w-full mb-4">
              <hr className="flex-grow border-gray-600" />
              <span className="text-gray-300 font-medium">or</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            <div className="mb-8">
              <FloatingLabelInput
                label="Email or username"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <button
              onClick={() => setIsIdentifierEntered(true)}
              className={`w-full px-5 py-2 ${
                !identifier ? "bg-gray-400" : "bg-white"
              } text-gray-800 font-bold rounded-full mb-16`}
              disabled={!identifier}
            >
              Next
            </button>

            <p>
              {"Don't have an account? "}
              <button className="text-blue-500" onClick={onSignUpOpen}>
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <div className="w-[30rem]">
            <h1 className="text-4xl font-bold mb-8">Enter your password</h1>
            <div className="w-full flex flex-col bg-gray-900 text-gray-600 px-3 py-1 mb-8 rounded-md">
              <span className="text-xs">Email</span>
              {identifier}
            </div>
            <div className="mb-8 flex relative items-center">
              <FloatingLabelInput
                label="Password"
                type={passwordFieldType}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 cursor-pointer"
                onClick={handlePasswordShowToggle}
              >
                {passwordFieldType === "password" ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </span>
            </div>
            <button
              onClick={handleLogin}
              className={`w-full px-5 py-2 ${
                !password ? "bg-gray-400" : "bg-white"
              } text-gray-800 font-bold rounded-full`}
              disabled={!password}
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SignInModal;
