import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} - ${error.statusText}`;
    message = error.data || "An unexpected server error occured.";
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-400">{message}</p>
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

export default ErrorPage;
