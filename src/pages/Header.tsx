import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginSignUpCognito from "./LoginSignUpCognito";
// import "./Header.css";

interface LoginModalStatus {
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<LoginModalStatus> = ({ setIsLoginOpen, setIsSignUpOpen }) => {
  const navigate = useNavigate();

  const handleMoveAllCrypto = () => {
    navigate("/allCrypto");
  };

  const handleMoveMain = () => {
    navigate("/");
  };
  // const handleMoveLogin = () => {
  //   setIsLoginOpen(true);
  // };

  // const handleMoveSignUp = () => {
  //   setIsSignUpOpen(true);
  // };

  // const handleLogOut = () => {};

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#f7931a",
        zIndex: 1000,
        border: 5,
        borderRadius: 0.5,
        borderColor: "#f7931a",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "space-between", height: 100, alignItems: "center" }}
      >
        <Box sx={{ justifyContent: "flex-start", display: "flex", gap: 2 }}>
          <Button onClick={handleMoveMain} variant="contained" sx={{ color: "white" }}>
            메인
          </Button>
          <Button onClick={handleMoveAllCrypto} variant="contained" sx={{ color: "white" }}>
            코인가격정보
          </Button>
        </Box>
        <Box>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            비트코인-이더리움 앱
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <LoginSignUpCognito></LoginSignUpCognito>

          {/* <Button variant="contained" onClick={handleMoveLogin}>
            LogIn
          </Button>

          <Button variant="contained" onClick={handleMoveSignUp}>
            SignUp
          </Button>
          <Button variant="contained" onClick={handleLogOut}>
            LogOut
          </Button> */}
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
