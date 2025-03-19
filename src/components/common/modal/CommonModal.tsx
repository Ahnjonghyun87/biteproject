import { Box, Button, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import BackDrop from "./BackDrop";

interface CommonModalProps {
  title: ReactNode;
  content: React.ReactNode | null;
  children?: React.ReactNode;
  path?: string;
  type?: "normal" | "confirm" | "non-click";
  size?: "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge"; // 모달 크기 옵션 추가
  onClose?: () => void;
}

const CommonModal = ({
  title,
  content,
  children,
  path,
  type = "normal",
  size = "medium",
  onClose,
}: CommonModalProps) => {
  const modal = useModal();
  const nav = useNavigate();

  const handleCloseByButton = () => {
    if (type === "confirm" && "normal" && "non-click") {
      modal.confirmClose();
    } else {
      if (path) {
        nav(`${path}`);
      }
      modal.close();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleConfirmClick = () => {
    if (type === "confirm") {
      modal.confirmClose();
    } else {
      if (path) {
        nav(`${path}`);
      }
      modal.close();
    }
    if (onClose) {
      onClose();
    }
  };

  const modalSizeClasses = {
    small: { width: 300 },
    medium: { width: 400 },
    large: { width: 500 },
    xlarge: { width: 600 },
    xxlarge: { width: 700 },
    xxxlarge: { width: 800 },
  };

  return (
    <BackDrop>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          textAlign: "center",
          ...modalSizeClasses[size],
        }}
      >
        <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleCloseByButton}>
          X
        </IconButton>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {title}
        </Typography>

        {content && <Box sx={{ mb: 2 }}>{content}</Box>}

        {children && <Box>{children}</Box>}
        {type === "normal" && (
          <Button variant="contained" color="warning" sx={{ mt: 2 }} onClick={handleConfirmClick}>
            확인
          </Button>
        )}
      </Box>
    </BackDrop>
  );
};

export default CommonModal;
