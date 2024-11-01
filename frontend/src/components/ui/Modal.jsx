import { FaXTwitter } from "react-icons/fa6";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-300 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-black rounded-2xl shadow-lg w-[40rem] h-[40rem] p-4">
        <div className="flex mb-8">
          <button
            onClick={onClose}
            className="absolute text-xl font-bold text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <div className="mx-auto">
            <FaXTwitter size={40} />
          </div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
