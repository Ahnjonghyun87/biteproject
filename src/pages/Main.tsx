import { Container } from "@mui/material";
import CryptoPrice from "./CryptoPrice";

const Main = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#37367b",
      }}
    >
      <CryptoPrice />
    </Container>
  );
};

export default Main;
