import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Modal from "../ui/Modal";
import FloatingLabelInput from "../ui/FloatingLabelInput";

const SignUpModal = ({ isOpen, onClose, onSignInOpen, isCreateAccount }) => {
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(isCreateAccount);
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    setIsCreateAccountOpen(isCreateAccount)
    setName("")
    setUsername("")
  }, [isOpen, isCreateAccount])

  const handleCreateAccount = () => {
    setIsCreateAccountOpen(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {!isCreateAccountOpen ? (
          <div className="w-[20rem]">
            <h1 className="text-4xl font-bold mb-8">Join Twixxer today</h1>

            <button className="w-full px-5 py-2 mb-4 flex items-center justify-center gap-1 bg-white hover:bg-gray-200 text-gray-800 font-bold rounded-full">
              <FcGoogle size={24} />
              <span>Sign up with Google</span>
            </button>

            <div className="flex items-center gap-4 w-full mb-4">
              <hr className="flex-grow border-gray-600" />
              <span className="text-gray-300 font-medium">or</span>
              <hr className="flex-grow border-gray-600" />
            </div>

            <button
              onClick={handleCreateAccount}
              className="w-full px-5 py-2 bg-white text-gray-800 font-bold rounded-full mb-16"
            >
              Create account
            </button>

            <p>
              Have an account already?{" "}
              <button className="text-blue-500" onClick={onSignInOpen}>
                Sign In
              </button>
            </p>
          </div>
        ) : (
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
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-16">
            <button
              className="w-full px-5 py-2 bg-white text-gray-800 font-bold rounded-full"
            >
              Log in
            </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SignUpModal;
