import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import SignInModal from "../components/func/SignInModal";
import SignUpModal from "../components/func/SignUpModal";
import OAuth from "../components/func/OAuth.jsx";

const SignIn = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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

      
      <SignInModal
        isOpen={isSignInOpen}
        onClose={closeModals}
        onSignUpOpen={openSignUp}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={closeModals}
      />
    </div>
  );
};

export default SignIn;
