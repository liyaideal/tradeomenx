import { createRoot } from "react-dom/client";
import "@fontsource/archivo-black/400.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/space-grotesk/800.css";
import "@fontsource/space-grotesk/900.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
