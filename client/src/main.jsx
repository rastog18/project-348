import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Axios from "./pages/Axios.jsx";
import Report from "./pages/Reports.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Axios />} />
        <Route path='/reports' element={<Report />} />
      </Routes>
    </Router>
  </StrictMode>
);
