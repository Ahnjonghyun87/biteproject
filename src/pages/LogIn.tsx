import { useEffect, useState } from "react";

import CommonModal from "../components/common/modal/CommonModal";
import "./LogIn.css";

interface LoginModalStatus {
  setIsLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn: React.FC<LoginModalStatus> = ({ setIsLoginOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);
  const closeModal = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="container">
      {isOpen && (
        <CommonModal
          title="로그인"
          type="non-click"
          size="large"
          onClose={closeModal}
          content={<div>로그인 테스트</div>}
        />
      )}
    </div>
  );
};

export default LogIn;
