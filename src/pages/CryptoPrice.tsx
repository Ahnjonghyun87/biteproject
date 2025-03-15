import { Box, Button, Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UpbitCoinPrice from "../types/upbitCoinPrice";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whichCrypto: string;
  setWhichCrypto: React.Dispatch<React.SetStateAction<string>>;
}

const CryptoPrice: React.FC<CryptoDetailPopUpStatus> = ({ setIsCryptoDetailOpen, whichCrypto, setWhichCrypto }) => {
  // const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();

  const { data, isPending, error } = useQuery<UpbitCoinPrice>({
    queryKey: ["btcEthApi"],
    queryFn: async () => {
      const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");

      return response.data;
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

  const onClickPricePopUpButton = (market: string) => {
    setIsCryptoDetailOpen(true);
    setWhichCrypto(market);
  };

  // const calculateChange = () => {
  //   if (!data?.opening_price || !data?.trade_price) return { amount: 0, rate: 0 };

  //   const changeAmount = data.trade_price - data.opening_price;
  //   const changeRate = ((changeAmount / data.opening_price) * 100).toFixed(2); // 소수점 2자리까지 표시

  //   return { amount: changeAmount, rate: changeRate };
  // };

  // const { amount, rate } = calculateChange();

  return (
    <Container maxWidth={"lg"} sx={{ height: "75vh" }}>
      <Box>
        {isPending ? (
          <div>로딩...</div>
        ) : error ? (
          <div>데이터를 불러오는 중 오류 발생!</div>
        ) : (
          data?.map((crypto, image) => (
            <Box
              display={"inline"}
              justifyContent={"center"}
              padding={5}
              gap={4}
              sx={{ fontSize: 48, width: "100%" }}
              key={crypto.market}
            >
              <img
                height={100}
                width={100}
                key={crypto.market}
                src={crypto.market === "KRW-BTC" ? "/images/BTC.svg" : "/images/ETH.svg"}
              />
              <Button onClick={() => onClickPricePopUpButton(crypto.market)} variant="contained">
                자세히보기
              </Button>
              <Typography
                component={"span"}
                padding={2}
                sx={{ fontSize: 36, color: crypto.change === "RISE" ? "red" : "blue" }}
              >
                {crypto.trade_price}
              </Typography>
              {/* <Typography component={"span"} sx={{ color: crypto.change === "RISE" ? "red" : "blue" }}>
                {crypto.change}
              </Typography> */}
              <Typography component={"span"} sx={{ color: crypto.change === "RISE" ? "red" : "blue" }}>
                {crypto.change}
              </Typography>
              {/* <Typography component={"span"} padding={2} sx={{ fontSize: 18 }}>
                <span style={{ color: amount > 0 ? "red" : "blue" }}>
                  {amount > 0 ? "▲" : "▼"} {Math.abs(amount)} 원 ({Math.abs(Number(rate))}%)
                </span>
              </Typography> */}
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
};

export default CryptoPrice;
