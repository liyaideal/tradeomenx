import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource/archivo-black/400.css";
import App from "./App.tsx";
import "./index.css";

const helmetContext = {};

createRoot(document.getElementById("root")!).render(
  <HelmetProvider context={helmetContext}>
    <App />
  </HelmetProvider>
);
