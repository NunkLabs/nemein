import { Toaster } from "components/ui/Toaster";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./globals.css";
import { ThemeProvider } from "./theme";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

ReactDOM.createRoot(root).render(
  <>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <Toaster />
  </>
);
