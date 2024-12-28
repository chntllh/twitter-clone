import { FaXTwitter } from "react-icons/fa6";
import FloatingLabelInput from "../FloatingLabelInput";
import Modal from "../Modal";
import { FormEvent, useEffect, useRef, useState } from "react";
import { login, preLogin } from "../../../api/api";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../store/reducer/user.reducer";
import { useNavigate } from "react-router-dom";
import OAuth from "../../func/OAuth";

type SignInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  openSignUp: () => void;
};

const SignInModal = ({ isOpen, onClose, openSignUp }: SignInModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isIdentifierEntered, setIsIdentifierEntered] = useState(false);

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const buttonCss =
    "w-full px-5 py-2 bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-bold rounded-full mb-16";

  const handlePreLogin = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!identifier) {
      setIdentifierError("No identifier supplied");
    }
    await preLogin(identifier)
      .then(() => {
        setIsIdentifierEntered(true);
      })
      .catch((error) => {
        const details = error.data.details;
        if (details.code) setIdentifierError(details.description);
      });
  };

  const handleLogin = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!identifier || !password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    dispatch(signInStart());

    await login(identifier, password)
      .then((res) => {
        dispatch(signInSuccess(res.data));
        navigate("/");
      })
      .catch((error) => {
        console.log(error.data);
        const details = error.data.details;
        if (details.code === "USER_NOT_FOUND")
          setIdentifierError(details.description);
        if (details.code === "PASSWORD_ERROR")
          setPasswordError(details.description);
        dispatch(signInFailure(error.data.message));
      });
  };

  useEffect(() => {
    if (!isIdentifierEntered && identifierInputRef.current) {
      identifierInputRef.current.focus();
    } else if (isIdentifierEntered && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isIdentifierEntered]);

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
        {!isIdentifierEntered ? (
          <div className="w-[20rem]">
            <h1 className="text-4xl font-bold mb-8">Sign in to Twixxer</h1>

            <OAuth />

            <div className="flex items-center gap-4 w-full mb-4">
              <hr className="flex-grow border-gray-600" />
              <span className="text-gray-300 font-medium">or</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePreLogin();
              }}
            >
              <FloatingLabelInput
                id="identifier"
                ref={identifierInputRef}
                label="Email or username"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setIdentifierError("");
                }}
                error={identifierError}
              />
            </div>

            <button
              type="submit"
              onClick={handlePreLogin}
              className={buttonCss}
              disabled={!identifier || identifierError !== ""}
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
            <h1 className="text-4xl font-bold mb-8">Enter your password</h1>
            <div className="w-full flex flex-col bg-gray-900 text-gray-600 px-3 py-1 mb-8 rounded-md">
              <span className="text-xs">Email</span>
              {identifier}
            </div>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin(e);
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
              onClick={handleLogin}
              className={buttonCss}
              disabled={!password || passwordError !== ""}
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
