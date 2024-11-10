import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import ErrorPopup from "./components/ui/ErrorPopup.jsx";

createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <App />
        <ErrorPopup />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
