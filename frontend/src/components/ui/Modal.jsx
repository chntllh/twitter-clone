import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  children,
  leftHeaderChild,
  centerHeaderChild,
  rightHeaderChild,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-blue-300 bg-opacity-30"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-black rounded-2xl shadow-lg w-[40rem] h-[40rem] overflow-hidden">
        {/* Transparent black bar on top of modal */}
        <div className="absolute bg-black opacity-30 w-full h-14 z-40" />

        {/* Elements on top of bar */}
        <div className="absolute w-full z-50">
          {/* Close button */}
          <div className="relative w-14 h-14">
            <button
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-xl hover:bg-gray-800 p-1.5 rounded-full"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
          {
            /* Headers left child */
            leftHeaderChild && (
              <div className="absolute left-14 top-2">{leftHeaderChild}</div>
            )
          }
          {
            /* Headers middle child */
            centerHeaderChild && (
              <div className="absolute left-1/2 -translate-x-1/2 top-2">
                {centerHeaderChild}
              </div>
            )
          }
          {
            /* Headers right child */
            rightHeaderChild && (
              <div className="absolute right-4 top-2">{rightHeaderChild}</div>
            )
          }
        </div>

        {/* Scrollable Content */}
        <div className="h-full w-full overflow-y-scroll scrollbar-none">
          {/* Gap for top bar */}
          <div className="mb-20" />

          <div className="mx-6 mb-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
