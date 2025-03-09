import axios from "axios";
import { useEffect, useState } from "react";
import UpbitCoinPrice from "../types/upbitCoinPrice";
const CryptoPrice = () => {
  const [btcPrice, setBtcPrice] = useState<UpbitCoinPrice>();
  // const QueryClient = useQuery<>({
  //   queryKey:["coinPrice", ]
  // })
  const GetPrice = async () => {
    try {
      const response = await axios.get("https://7o712sia8j.execute-api.ap-northeast-1.amazonaws.com/test1/items");
      setBtcPrice(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetPrice();
  }, []);
  return (
    <div>
      CryptoPrice
      <div>
        {btcPrice ? (
          btcPrice.map((b, i) => {
            return (
              <li key={b.market}>
                <img key={i} src={`./images/${b.market.substring(4)}`}></img>
                <span>{b.market.substring(4)}</span>
                <span>{b.trade_price}</span>
              </li>
            );
          })
        ) : (
          <div>로딩...</div>
        )}
      </div>
    </div>
  );
};

export default CryptoPrice;
