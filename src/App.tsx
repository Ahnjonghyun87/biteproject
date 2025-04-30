import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import CryptoPriceDetail from "./pages/CryptoPriceDetail";
import FearAndGreedDetail from "./pages/FearAndGreedDetail";
import Header from "./pages/Header";
import LogIn from "./pages/LogIn";
import Main from "./pages/Main";
import SignUp from "./pages/SignUp";
import "./reset.css";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whichCrypto: string;
  setWhichCrypto?: React.Dispatch<React.SetStateAction<string>>;
}

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCryptoDetailOpen, setIsCryptoDetailOpen] = useState(false);
  const [whichCrypto, setWhichCrypto] = useState<string>("");
  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} setIsSignUpOpen={setIsSignUpOpen} />
      <Routes>
        <Route
          path="/"
          element={
            <Main
              setIsCryptoDetailOpen={setIsCryptoDetailOpen}
              whichCrypto={whichCrypto}
              setWhichCrypto={setWhichCrypto}
            />
          }
        />
        <Route path="/sidebar" element={<SideBar />} />
        <Route path="/FearAndGreedDetail" element={<FearAndGreedDetail />} />
      </Routes>

      {isLoginOpen && <LogIn setIsLoginOpen={setIsLoginOpen} />}
      {isSignUpOpen && <SignUp setIsSignUpOpen={setIsSignUpOpen} />}
      {isCryptoDetailOpen && (
        <CryptoPriceDetail
          setIsCryptoDetailOpen={setIsCryptoDetailOpen}
          whichCrypto={whichCrypto}
          setWhichCrypto={setWhichCrypto}
        />
      )}
    </>
  );
}

export default App;
