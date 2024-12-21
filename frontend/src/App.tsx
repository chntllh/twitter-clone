import { RouterProvider } from "react-router-dom";
import router from "./routes/RoutesConfig";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
