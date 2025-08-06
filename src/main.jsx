import './i18n';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.jsx";
import * as serviceWorker from './utils/serviceWorker';

// Register service worker for PWA functionality
serviceWorker.register({
  onSuccess: () => console.log('App is ready for offline use'),
  onUpdate: () => console.log('New content available; please refresh')
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);