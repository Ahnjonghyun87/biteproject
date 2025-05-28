import { Box, Container } from "@mui/material";

const AllCrypto = () => {
  return (
    <Container
      maxWidth={"xl"}
      sx={{
        minHeight: "100vh", // 👈 최소 높이 설정
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // 👈 중앙 정렬
        alignItems: "center",
        paddingTop: "10vh",
      }}
    >
      거래소
      <Box
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          color: "gray",
          border: 1,
          placeItems: "center",
          display: "grid",
        }}
      >
        Test
      </Box>
    </Container>
  );
};

export default AllCrypto;
