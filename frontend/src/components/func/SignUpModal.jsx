import Modal from "../ui/Modal";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const SignUpModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isInfoEntered, setIsInfoEntered] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  const handleCloseModal = () => {
    setIsInfoEntered(false);
    setName("");
    setEmail("");
    setPassword("");
    onClose();
  };

  const handlePasswordShowToggle = () => {
    passwordFieldType === "password"
      ? setPasswordFieldType("text")
      : setPasswordFieldType("password");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return dispatch(signUpFailure("Please fill all the fields"));
    }

    try {
      dispatch(signUpStart());

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signUpFailure(data.message));
      }
      if (res.ok) {
        dispatch(signUpSuccess(data.body));
        navigate("/");
      }
    } catch (error) {
      dispatch(signUpFailure(error));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <div className="flex flex-col items-center">
        {!isInfoEntered ? (
          <div className="w-[30rem]">
            <h1 className="text-4xl font-bold mb-8">Create your account</h1>
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
                Log in
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
  );
};

export default SignUpModal;
