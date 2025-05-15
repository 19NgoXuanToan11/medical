import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/home/HomePage";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
