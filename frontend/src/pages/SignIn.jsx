import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import OAuth from "../components/func/OAuth.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal.jsx";
import FloatingLabelInput from "../components/ui/FloatingLabelInput.jsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../store/reducer/user.reducer.js";
import axios from "axios";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const [isIdentifierEntered, setIsIdentifierEntered] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [isInfoEntered, setIsInfoEntered] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const openSignIn = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
  };
  const openSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };
  const closeModals = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
    setIsIdentifierEntered(false);
    setIdentifier("");
    setPassword("");
    setPasswordFieldType("password");
    setIsInfoEntered(false);
    setName("");
    setEmail("");
  };

  const handlePasswordShowToggle = () => {
    passwordFieldType === "password"
      ? setPasswordFieldType("text")
      : setPasswordFieldType("password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      if (res.data.success === false) {
        dispatch(signInFailure(res.data.message));
      } else {
        dispatch(signInSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(signInFailure(errorMessage));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return dispatch(signUpFailure("Please fill all the fields"));
    }

    try {
      dispatch(signUpStart());

      const res = await axios.post("/api/auth/register", {
        email,
        name,
        password,
      });

      console.log("Sign up kek");

      if (res.data.success === false) {
        dispatch(signUpFailure(res.data.message));
      } else {
        dispatch(signUpSuccess(res.data));
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch(signUpFailure(errorMessage));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-20">
      <div className="text-6xl md:text-[20rem] flex items-center justify-center">
        <FaXTwitter />
      </div>
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-6xl mb-6 font-bold">Happening now</h1>
        <h2 className="text-4xl mb-4 font-bold">Join today</h2>

        <div className="w-[20rem]">
          <OAuth />

          <div className="flex items-center gap-4 w-full mb-4">
            <hr className="flex-grow border-gray-600" />
            <span className="text-gray-300 font-medium">or</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          <button
            className="w-full px-5 py-2 mb-8 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full"
            onClick={openSignUp}
          >
            Create account
          </button>

          <h3 className="text-lg mb-2">Already have an account?</h3>
          <button
            className="w-full px-5 py-2 text-blue-400 hover:bg-blue-900 border border-gray-600 font-bold rounded-full"
            onClick={openSignIn}
          >
            Sign in
          </button>
        </div>
      </div>

      {
        /* Sign in modal */
        isSignInOpen && (
          <Modal
            isOpen={isSignInOpen}
            onClose={closeModals}
            centerHeaderChild={
              <div className="mt-1">
                <FaXTwitter size={32} />
              </div>
            }
          >
            <div className="flex flex-col items-center">
              {!isIdentifierEntered ? (
                <div className="w-[20rem]">
                  <h1 className="text-4xl font-bold mb-8">
                    Sign in to Twixxer
                  </h1>

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
                    <button className="text-blue-500" onClick={openSignUp}>
                      Sign Up
                    </button>
                  </p>
                </div>
              ) : (
                <div className="w-[30rem]">
                  <h1 className="text-4xl font-bold mb-8">
                    Enter your password
                  </h1>
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
        )
      }

      {
        /* Sign up modal */
        isSignUpOpen && (
          <Modal
            isOpen={isSignUpOpen}
            onClose={closeModals}
            centerHeaderChild={
              <div className="mt-1">
                <FaXTwitter size={32} />
              </div>
            }
          >
            <div className="flex flex-col items-center">
              {!isInfoEntered ? (
                <div className="w-[30rem]">
                  <h1 className="text-4xl font-bold mb-8">
                    Create your account
                  </h1>
                  <div className="mb-8">
                    <FloatingLabelInput
                      label="Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-8">
                    <FloatingLabelInput
                      label="Email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-16">
                    <button
                      className={`w-full px-5 py-2 ${
                        !name || !email ? "bg-gray-400" : "bg-white"
                      } text-gray-800 font-bold rounded-full`}
                      disabled={!name || !email}
                      onClick={() => setIsInfoEntered(true)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-[30rem]">
                  <h1 className="text-4xl font-bold mb-8">Set a password</h1>
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
                    onClick={handleSignup}
                    className={`w-full px-5 py-2 ${
                      !password ? "bg-gray-400" : "bg-white"
                    } text-gray-800 font-bold rounded-full`}
                    disabled={!password}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )
      }
    </div>
  );
};

export default SignIn;
