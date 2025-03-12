import { Box, Container } from "@mui/material";
import CryptoPrice from "./CryptoPrice";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Main: React.FC<CryptoDetailPopUpStatus> = ({ setIsCryptoDetailOpen }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#37367b",
        display: "flex", // 중앙 정렬을 위해 flex 사용
        justifyContent: "center", // 가로 중앙 정렬
        alignItems: "center", // 세로 중앙 정렬
      }}
    >
      <Box
        sx={{
          textAlign: "center", // 내부 콘텐츠 중앙 정렬
          color: "white", // 텍스트 색상 (배경 대비)
        }}
      >
        <CryptoPrice setIsCryptoDetailOpen={setIsCryptoDetailOpen} />
        {/* <CryptoPriceDetail setIsCryptoDetailOpen={setIsCryptoDetailOpen} /> */}
      </Box>
    </Container>
  );
};

export default Main;
