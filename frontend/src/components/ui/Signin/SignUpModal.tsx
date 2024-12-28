import { FaXTwitter } from "react-icons/fa6";
import FloatingLabelInput from "../FloatingLabelInput";
import Modal from "../Modal";
import { FormEvent, useEffect, useRef, useState } from "react";
import { preRegister, signup } from "../../../api/api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../../../store/reducer/user.reducer";

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SignUpModal = ({ isOpen, onClose }: SignUpModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isInfoEntered, setIsInfoEntered] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const buttonCss =
    "w-full px-5 py-2 bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-bold rounded-full mb-16";

  const handlePreSignup = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!name) {
      setNameError("No name supplied");
    }
    if (!email) {
      setEmailError("No email supplied");
    }
    await preRegister(email, name)
      .then(() => setIsInfoEntered(true))
      .catch((error) => {
        const details = error.data.details;
        if (details.code === "INVALID_EMAIL" || details.code === "EMAIL_EXISTS")
          setEmailError(details.description);
        else if (details.code === "NAME_LENGTH_ERROR")
          setNameError(details.description);
      });
  };

  const handleSignup = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!name || !email || !password) {
      return dispatch(signUpFailure("Please fill all the fields"));
    }

    if (password.length < 6)
      return setPasswordError("Password must be over 6 characters.");

    dispatch(signUpStart());

    await signup(email, name, password)
      .then((res) => {
        dispatch(signUpSuccess(res.data));
        navigate("/");
      })
      .catch((error) => {
        dispatch(signUpFailure(error.response.data.message));
      });
  };

  useEffect(() => {
    if (!isInfoEntered && identifierInputRef.current) {
      identifierInputRef.current.focus();
    } else if (isInfoEntered && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isInfoEntered]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      centerHeaderChild={
        <div className="mt-1">
          <FaXTwitter size={32} />
        </div>
      }
    >
      <div className="flex flex-col items-center">
        {!isInfoEntered ? (
          <div className="w-[30rem]">
            <h1 className="text-4xl font-bold mb-8">Create your account</h1>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter" && emailInputRef.current) {
                  emailInputRef.current.focus();
                }
              }}
            >
              <FloatingLabelInput
                id="name"
                ref={identifierInputRef}
                label="Name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                error={nameError}
              />
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePreSignup();
                }
              }}
            >
              <FloatingLabelInput
                id="email"
                ref={emailInputRef}
                label="Email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                error={emailError}
              />
            </div>
            <div className="mb-16">
              <button
                className={buttonCss}
                disabled={!name || !email}
                onClick={handlePreSignup}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="w-[30rem]">
            <h1 className="text-4xl font-bold mb-8">Set a password</h1>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignup(e);
                }
              }}
            >
              <FloatingLabelInput
                id="password"
                ref={passwordInputRef}
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                error={passwordError}
              />
            </div>
            <button
              onClick={handleSignup}
              className={buttonCss}
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
