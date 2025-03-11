import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import CryptoPriceDetail from "./pages/CryptoPriceDetail";
import Header from "./pages/Header";
import LogIn from "./pages/LogIn";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import "./reset.css";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCryptoDetailOpen, setIsCryptoDetailOpen] = useState(false);
  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} setIsSignUpOpen={setIsSignUpOpen} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sidebar" element={<SideBar />} />
      </Routes>
      {isLoginOpen && <LogIn setIsLoginOpen={setIsLoginOpen} />}
      {isSignUpOpen && <SignUp setIsSignUpOpen={setIsSignUpOpen} />}
      {isCryptoDetailOpen && <CryptoPriceDetail setIsCryptoDetailOpen={setIsCryptoDetailOpen} />}
    </>
  );
}

export default App;
