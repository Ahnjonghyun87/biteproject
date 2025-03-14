import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/modal/CommonModal";
import UpbitCoinPrice from "../types/upbitCoinPrice";

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
  const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsCryptoDetailOpen(false);
  };

  // useEffect(() => {
  //   if (whichCrypto) {
  //     setIsOpen(true);
  //   }
  // }, []);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    GetPrice();
  }, []);

  const GetPrice = async () => {
    try {
      const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");
      setBtcEthPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {isOpen && (
        <CommonModal
          title={whichCrypto === "KRW-BTC" ? "BTC" : "ETH"}
          type="non-click"
          size="large"
          onClose={closeModal}
          content={
            <Box>
              {btcEthPrice ? (
                btcEthPrice.map((crypto, image) => {
                  return (
                    <Box
                      display={"inline"}
                      justifyContent={"center"}
                      padding={5}
                      gap={4}
                      sx={{ fontSize: 24, width: "100%" }}
                      key={crypto.market}
                    >
                      <Typography component={"span"} padding={2} sx={{ fontSize: 18 }}>
                        {crypto.trade_price}
                      </Typography>
                      <Typography component={"span"} sx={{ color: crypto.change === "RISE" ? "green" : "red" }}>
                        {crypto.change}
                      </Typography>
                    </Box>
                  );
                })
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
