import React from "react";
import { createRoot } from "react-dom/client";
import AMPLSAppMap from "../ampls_interactive_web_app_blueprint.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AMPLSAppMap />
  </React.StrictMode>
);
