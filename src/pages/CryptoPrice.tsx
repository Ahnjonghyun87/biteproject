import { Box, Button, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { UpbitCoinResponse } from "../types/upbitCoin";
import DollarIndex from "./DollarIndex";
import FearAndGreed from "./FearAndGreed";
import M2price from "./M2price";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whichCrypto: string;
  setWhichCrypto: React.Dispatch<React.SetStateAction<string>>;
}

const CryptoPrice: React.FC<CryptoDetailPopUpStatus> = ({ setIsCryptoDetailOpen, whichCrypto, setWhichCrypto }) => {
  // const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();

  const { data, isPending, error } = useQuery<UpbitCoinResponse>({
    queryKey: ["btcEthApi"],
    queryFn: async () => {
      const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/items");
      // const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

      return response.data ?? { items: [] };
    },
    staleTime: 1000,
  });

  // const [whichCrypto, setWhichCrypto] = useState<String>("");

  // const GetPrice = async () => {
  //   try {
  //     const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");
  //     setBtcEthPrice(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   GetPrice();
  // }, []);

  useEffect(() => {
    console.log("API 응답 데이터:", data);
  }, [data]);

  const onClickPricePopUpButton = (market: string) => {
    setIsCryptoDetailOpen(true);
    setWhichCrypto(market);
  };

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
        // paddingBottom: "20vh",
      }}
    >
      <Box>
        <FearAndGreed />
      </Box>
      <Box
        sx={{
          display: "flex", // 👈 추가!
          justifyContent: "center",
          alignItems: "center",
          gap: 4, // 아이템 간격
          flexWrap: "wrap", // 👉 모바일 대응을 위해서 추천
        }}
      >
        {isPending ? (
          <div>로딩...</div>
        ) : error ? (
          <div>데이터를 불러오는 중 오류 발생!</div>
        ) : (
          data?.items?.map((crypto, index) => (
            <Box
              sx={{
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center", // 👈 중앙 정렬
                // alignItems: "center",
                // width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
                mt: 4,
              }}
              key={`${crypto.market}-${index}`}
            >
              {" "}
              <Box
                display={"inline"}
                justifyContent={"center"}
                padding={5}
                gap={4}
                border={1}
                sx={{
                  width: 420,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  padding: 2,
                  textAlign: "center",
                  boxShadow: 2,
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column" // 👈 수직 정렬!
                  alignItems="center"
                  gap={1}
                >
                  <img
                    height={100}
                    width={100}
                    src={crypto.market === "KRW-BTC" ? "/images/BTC.svg" : "/images/ETH.svg"}
                    style={{ padding: "20px" }}
                  />
                  <Button onClick={() => onClickPricePopUpButton(crypto.market)} variant="contained">
                    자세히보기
                  </Button>
                </Box>
                <Typography
                  component={"span"}
                  padding={2}
                  sx={{ fontSize: 36, color: crypto.change === "RISE" ? "red" : "blue" }}
                >
                  {crypto.trade_price}
                </Typography>{" "}
                {
                  <Typography
                    component={"span"}
                    sx={{
                      color:
                        crypto.change === "RISE"
                          ? "red"
                          : crypto.change === "FALL"
                            ? "blue"
                            : crypto.change === "EVEN"
                              ? "gray"
                              : "black",
                    }}
                  >
                    {/* {crypto.change_price} 원{" "}
                    {crypto.opening_price < crypto.trade_price
                      ? "▲"
                      : crypto.opening_price > crypto.trade_price
                        ? "▼"
                        : crypto.change_price === 0
                          ? "--"
                          : "--"}{" "}
                    {""}
                    {(crypto.change_rate * 100).toFixed(2)}% */}
                    {crypto.change_price.toLocaleString()}&nbsp;원&nbsp;
                    {crypto.opening_price < crypto.trade_price
                      ? "▲"
                      : crypto.opening_price > crypto.trade_price
                        ? "▼"
                        : "--"}
                    &nbsp;
                    {(crypto.change_rate * 100).toFixed(2)}%
                  </Typography>
                }
              </Box>
            </Box>
          ))
        )}
      </Box>
      <Box
        sx={{
          display: "flex", // 가로로 정렬
          justifyContent: "center", // 가운데 정렬
          alignItems: "center", // 세로 기준 정렬
          gap: 4, // 컴포넌트 사이 간격
          mt: 4, // 위쪽 여백
        }}
      >
        <M2price />
        <DollarIndex />
      </Box>
    </Container>
  );
};

export default CryptoPrice;
