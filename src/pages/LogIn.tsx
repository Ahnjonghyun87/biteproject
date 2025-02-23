import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import CommonModal from "../components/common/modal/CommonModal";

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
    <div>
      {isOpen && (
        <CommonModal
          title="로그인"
          type="non-click"
          size="large"
          onClose={closeModal}
          content={
            <Box
              sx={{
                maxWidth: "800px", // 컨테이너 최대 너비 지정
                padding: "20px", // 내부 여백 추가
                margin: "0 auto", // 중앙 정렬
                lineHeight: "1.8", // 줄 간격 조정
                letterSpacing: "0.05em", // 글자 간격 조정
              }}
            >
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a
              Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of
              ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
              amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is
              reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
              by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914
              translation by H. Rackham.
            </Box>
          }
        />
      )}
    </div>
  );
};

export default LogIn;
