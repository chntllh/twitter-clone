import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ThemeProvider from "./components/ThemeProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";
import ErrorPopup from "./components/ui/ErrorPopup";

const rootElement = document.getElementById("root")
if (rootElement) {
  createRoot(rootElement).render(
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <ThemeProvider>
          <App />
          <ErrorPopup />
        </ThemeProvider>
      </Provider>
    </PersistGate>
  );
} else {
  console.error("Root element not found.");
}

