import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-gray-400">The page you are looking for does not exist.</p>
        <button
          onClick={handleBackHome}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-400 rounded-md transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
