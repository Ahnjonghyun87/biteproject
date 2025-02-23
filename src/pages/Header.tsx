import { AppBar, Box, Container, Typography } from "@mui/material";
import Button from "@mui/material/Button";
// import "./Header.css";

interface LoginModalStatus {
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<LoginModalStatus> = ({ setIsLoginOpen }) => {
  const handleMoveLogin = () => {
    setIsLoginOpen(true);
  };

  const handleMoveSignUp = () => {};

  const handleLogOut = () => {};

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#f7931a", zIndex: 1000 }}>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "space-between", height: 100, alignItems: "center" }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          비트코인-이더리움 앱
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleMoveLogin}>
            LogIn
          </Button>

          <Button variant="contained" onClick={handleMoveSignUp}>
            SignUp
          </Button>
          <Button variant="contained" onClick={handleLogOut}>
            LogOut
          </Button>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Header;
