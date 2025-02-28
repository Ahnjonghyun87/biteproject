import { Button, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CommonModal from "../components/common/modal/CommonModal";

interface LoginModalStatus {
  setIsSignUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
}

const SignUp: React.FC<LoginModalStatus> = ({ setIsSignUpOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);
  const closeModal = () => {
    setIsSignUpOpen(false);
  };

  const { register, handleSubmit, formState, watch, control } = useForm<SignUpData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
    },
  });

  const password = watch("password");

  return (
    <div>
      {isOpen && (
        <CommonModal
          title="회원가입"
          type="non-click"
          size="large"
          onClose={closeModal}
          content={
            <Container
              sx={{
                maxWidth: "800px", // 컨테이너 최대 너비 지정
                padding: "20px", // 내부 여백 추가
                margin: "0 auto", // 중앙 정렬
                lineHeight: "1.8", // 줄 간격 조정
                letterSpacing: "0.05em", // 글자 간격 조정
              }}
            >
              <form onSubmit={handleSubmit(onsubmit)}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "이메일을 입력해주세요",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "유효하지 않은 이메일 형식입니다",
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      id="userEmail"
                      placeholder="E-mail"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 50 }}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : `${value.length}/50`}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "비밀번호를 입력해주세요",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
                      message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다 (8~20자)",
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      id="password"
                      placeholder="password"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 20 }}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : `${value.length}/20`}
                    />
                  )}
                />
                <Controller
                  name="nickname"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "닉네임을 입력해주세요",
                    pattern: {
                      value: /^[가-힣A-Za-z\d]{2,15}$/,
                      message: "닉네임은 영문,한글과 숫자로 3~15자 이내로 입력해주세요",
                    },
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextField
                      id="userNickname"
                      placeholder="nickname"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 15 }}
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : `${value.length}/15`}
                    />
                  )}
                />
                <Button variant="contained" type="submit">
                  가입
                </Button>
              </form>
            </Container>
          }
        />
      )}
    </div>
  );
};

export default SignUp;
