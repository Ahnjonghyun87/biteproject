import { Box, Button, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/modal/CommonModal";
import { UpbitCoinItem } from "../types/upbitCoin";
import CryptoDailyCandle from "./CryptoDailyCandle";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whichCrypto: string;
  setWhichCrypto?: React.Dispatch<React.SetStateAction<string>>;
}

const CryptoPriceDetail: React.FC<CryptoDetailPopUpStatus> = ({
  setIsCryptoDetailOpen,
  whichCrypto,
  setWhichCrypto,
}) => {
  // const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsCryptoDetailOpen(false);
  };

  console.log(whichCrypto);

  // useEffect(() => {
  //   if (whichCrypto) {
  //     setIsOpen(true);
  //   }
  // }, []);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  // useEffect(() => {
  //   GetPrice();
  // }, []);

  // const GetPrice = async () => {
  //   try {
  //     const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");
  //     setBtcEthPrice(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const { data, isPending, error } = useQuery<UpbitCoinItem>({
    queryKey: ["btcEthApi", whichCrypto],
    queryFn: async () => {
      const response = await axios.get("https://mezflrpv8d.execute-api.ap-northeast-1.amazonaws.com/bite/items");

      // return response.data;
      return whichCrypto === "KRW-BTC" ? response.data.items[0] : response.data.items[1];
    },
    staleTime: 1000,
  });

  // useEffect(() => {
  //   console.log("API 응답 데이터:", data);
  // }, [data]);
  const handleChangeCrypto = () => {
    if (setWhichCrypto) {
      setWhichCrypto(whichCrypto === "KRW-BTC" ? "KRW-ETH" : "KRW-BTC");
    }
  };

  return (
    <div>
      {isOpen && (
        <CommonModal
          title={
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
              <Button onClick={handleChangeCrypto}>{"<"}</Button>
              <img
                height={25}
                width={25}
                src={whichCrypto === "KRW-BTC" ? "/images/BTC.svg" : "/images/ETH.svg"}
                alt="Crypto Logo"
              />
              {/* 타이틀과 이미지 정렬 */}
              {whichCrypto === "KRW-BTC" ? "BTC" : "ETH"}
              <Button onClick={handleChangeCrypto}>{">"}</Button>
            </Box>
          }
          type="non-click"
          size="xxxlarge"
          onClose={closeModal}
          content={
            <Box display={"flex"}>
              <Box sx={{ width: "50%", textAlign: "left" }}>
                <CryptoDailyCandle whichCrypto={whichCrypto} />
              </Box>
              {data ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="right" // 수직 중앙 정렬
                  justifyContent="center" // 화면 중앙 정렬
                  textAlign="right"
                  // paddingRight={3}
                  gap={0.5}
                  sx={{ fontSize: 24, width: "100%" }}
                  key={data.market}
                >
                  {" "}
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    <span style={{ color: "black" }}>현재가: </span>
                    <span style={{ color: data.change === "RISE" ? "red" : "blue" }}>{data.trade_price}</span>
                    <span style={{ color: "black" }}> 원</span>
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    시초가: {""}
                    {data.opening_price} 원
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    전일종가: {""}
                    {data.prev_closing_price} 원
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    <span style={{ color: "black" }}>당일고가: </span>
                    <span style={{ color: "red" }}>{data.high_price}</span>
                    <span style={{ color: "black" }}> 원</span>
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    <span style={{ color: "black" }}>당일저가: </span>
                    <span style={{ color: "blue" }}>{data.low_price}</span>
                    <span style={{ color: "black" }}> 원</span>
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    금일 변동금액: {""}
                    <span
                      style={{
                        color:
                          data.change === "RISE"
                            ? "red"
                            : data.change === "FALL"
                              ? "blue"
                              : data.change === "EVEN"
                                ? "gray"
                                : "black",
                      }}
                    >
                      {data.change_price}
                    </span>{" "}
                    원{" "}
                    <span style={{ color: data.change === "RISE" ? "red" : "blue" }}>
                      {data.opening_price < data.trade_price
                        ? "▲"
                        : data.opening_price > data.trade_price
                          ? "▼"
                          : data.change_price === 0
                            ? "--"
                            : "--"}{" "}
                      {""}
                      {(data.change_rate * 100).toFixed(2)}%
                    </span>
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    <span style={{ color: "black" }}>52주 최고가: </span>
                    <span style={{ color: "red" }}>{data.highest_52_week_price}</span>
                    <span style={{ color: "black" }}> 원 </span>
                    <span style={{ color: "gray" }}>({data.highest_52_week_date})</span>
                  </Typography>
                  <Typography component={"span"} padding={1} sx={{ fontSize: 12 }}>
                    <span style={{ color: "black" }}>52주 최저가: </span>
                    <span style={{ color: "blue" }}>{data.lowest_52_week_price}</span>
                    <span style={{ color: "black" }}> 원 </span>
                    <span style={{ color: "gray" }}>({data.lowest_52_week_date})</span>
                  </Typography>
                </Box>
              ) : (
                <div>로딩...</div>
              )}
            </Box>
          }
        />
      )}
    </div>
  );
};

export default CryptoPriceDetail;
