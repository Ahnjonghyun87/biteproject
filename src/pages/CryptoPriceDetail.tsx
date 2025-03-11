import axios from "axios";
import React, { useEffect, useState } from "react";
import CommonModal from "../components/common/modal/CommonModal";
import UpbitCoinPrice from "../types/upbitCoinPrice";

interface CryptoDetailPopUpStatus {
  setIsCryptoDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CryptoPriceDetail: React.FC<CryptoDetailPopUpStatus> = ({ setIsCryptoDetailOpen }) => {
  const [btcEthPrice, setBtcEthPrice] = useState<UpbitCoinPrice>();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);
  const closeModal = () => {
    setIsCryptoDetailOpen(false);
  };
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
          title="회원가입"
          type="non-click"
          size="large"
          onClose={closeModal}
          content={<div>CryptoPriceDetail</div>}
        />
      )}
    </div>
  );
};

export default CryptoPriceDetail;
