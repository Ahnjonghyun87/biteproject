import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import Header from "./pages/Header";
import LogIn from "./pages/LogIn";
import Main from "./pages/Main";
import "./reset.css";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sidebar" element={<SideBar />} />
      </Routes>
      {isLoginOpen && <LogIn setIsLoginOpen={setIsLoginOpen} />}
    </>
  );
}

export default App;
