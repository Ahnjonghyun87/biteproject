import { Box, Button, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { UpbitCoinResponse } from "../types/upbitCoin";

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
        paddingBottom: "55vh",
      }}
    >
      <Box>
        {isPending ? (
          <div>로딩...</div>
        ) : error ? (
          <div>데이터를 불러오는 중 오류 발생!</div>
        ) : (
          data?.items?.map((crypto, index) => (
            <Container
              sx={{
                display: "inline",
                flexDirection: "column",
                justifyContent: "center", // 👈 중앙 정렬
                alignItems: "center",
              }}
              key={`${crypto.market}-${index}`}
            >
              {" "}
              <img height={100} width={100} src={crypto.market === "KRW-BTC" ? "/images/BTC.svg" : "/images/ETH.svg"} />
              <Box
                display={"inline"}
                justifyContent={"center"}
                padding={5}
                gap={4}
                border={1}
                sx={{ fontSize: 48, width: "100%" }}
              >
                <Button onClick={() => onClickPricePopUpButton(crypto.market)} variant="contained">
                  일일변동량
                </Button>
                {/* <Button variant="contained">차트보기</Button> */}
                <Typography
                  component={"span"}
                  padding={2}
                  sx={{ fontSize: 36, color: crypto.change === "RISE" ? "red" : "blue" }}
                >
                  {crypto.trade_price}
                </Typography>
                {/* <Typography component={"span"} sx={{ color: crypto.change === "RISE" ? "red" : "blue" }}>
              {crypto.change}
             </Typography> */}{" "}
                {
                  // <Typography component={"span"} sx={{ color: crypto.change === "RISE" ? "red" : "blue" }}>
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
                    {crypto.change_price} 원{" "}
                    {crypto.change_price > 0
                      ? "▲"
                      : crypto.change_price < 0
                        ? "▼"
                        : crypto.change_price === 0
                          ? "--"
                          : "even"}{" "}
                    {""}
                    {(crypto.change_rate * 100).toFixed(2)}%
                  </Typography>
                }
                {/* <Typography component={"span"} padding={2} sx={{ fontSize: 18 }}>
                  <span style={{ color: amount > 0 ? "red" : "blue" }}>
                    {amount > 0 ? "▲" : "▼"} {Math.abs(amount)} 원 ({Math.abs(Number(rate))}%)
                  </span>
                </Typography> */}
              </Box>
            </Container>
          ))
        )}
      </Box>
    </Container>
  );
};

export default CryptoPrice;
