import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/pages";
import "../src/app/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
