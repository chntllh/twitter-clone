import { FormEvent, useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import OAuth from "../components/func/OAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import FloatingLabelInput from "../components/ui/FloatingLabelInput";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  signUpFailure,
  signUpStart,
  signUpSuccess,
} from "../store/reducer/user.reducer";
import { login, preLogin, preRegister, signup } from "../api/api";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const [isIdentifierEntered, setIsIdentifierEntered] = useState(false);
  const [isInfoEntered, setIsInfoEntered] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const buttonCss =
    "w-full px-5 py-2 bg-white disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-800 font-bold rounded-full mb-16";

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
    setIdentifierError("");
    setPassword("");
    setPasswordError("");
    setIsInfoEntered(false);
    setName("");
    setEmail("");
  };

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
    if (isSignInOpen) {
      if (!isIdentifierEntered && identifierInputRef.current) {
        identifierInputRef.current.focus();
      } else if (isIdentifierEntered && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
    if (isSignUpOpen) {
      if (!isInfoEntered && identifierInputRef.current) {
        identifierInputRef.current.focus();
      } else if (isInfoEntered && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  }, [isSignInOpen, isIdentifierEntered, isSignUpOpen, isInfoEntered]);

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
                  <h1 className="text-4xl font-bold mb-8">
                    Enter your password
                  </h1>
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
        )
      }
    </div>
  );
};

export default SignIn;
