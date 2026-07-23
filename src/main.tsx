import { addCollection } from "@iconify/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ICON_COLLECTIONS } from "@/constants/icons";
import App from "./App.tsx";
import "@/App.css";

// Register bundled icon data so icons render without Iconify API requests.
for (const collection of ICON_COLLECTIONS) {
  addCollection(collection);
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
