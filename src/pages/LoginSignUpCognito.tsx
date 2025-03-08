import { Box, Button, Container, Typography } from "@mui/material";
import { useAuth } from "react-oidc-context";

const LoginSignUpCognito = () => {
  const auth = useAuth();

  // const signOutRedirect = () => {
  //   const clientId = "7jr33v0qavqbsg33965pu9kft7";
  //   const logoutUri = "<logout uri>";
  //   const cognitoDomain = "https://ap-northeast-1ml8c3uiu9.auth.ap-northeast-1.amazoncognito.com";
  //   window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  // };

  const signUpRedirect = () => {
    const clientId = "7jr33v0qavqbsg33965pu9kft7"; // 앱 클라이언트 ID
    const cognitoDomain = "https://ap-northeast-1ml8c3uiu9.auth.ap-northeast-1.amazoncognito.com";
    const redirectUri = "http://localhost:3000/";

    window.location.href = `${cognitoDomain}/signup?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <Container>
      {auth.isAuthenticated ? (
        <Box sx={{}}>
          <Typography> Hello: {auth.user?.profile.email} </Typography>
          {/* <Typography> ID Token: {auth.user?.id_token} </Typography>
          <Typography> Access Token: {auth.user?.access_token} </Typography>
          <Typography> Refresh Token: {auth.user?.refresh_token} </Typography> */}

          <Button sx={{ color: "white" }} onClick={() => auth.removeUser()}>
            로컬 로그아웃
          </Button>
          {/* <Button sx={{ color: "white" }} onClick={() => signOutRedirect()}>
            서버 로그아웃
          </Button> */}
        </Box>
      ) : (
        <Box>
          <Button onClick={() => auth.signinRedirect()}>로그인</Button>
          <Button onClick={() => signUpRedirect()}>회원가입</Button>
        </Box>
      )}
    </Container>
  );

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>
  //       <pre> Hello: {auth.user?.profile.email} </pre>
  //       <pre> ID Token: {auth.user?.id_token} </pre>
  //       <pre> Access Token: {auth.user?.access_token} </pre>
  //       <pre> Refresh Token: {auth.user?.refresh_token} </pre>

  //       <button onClick={() => auth.removeUser()}>로그아웃</button>
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     <button onClick={() => auth.signinRedirect()}>로그인</button>
  //     <button onClick={() => signUpRedirect()}>회원가입</button>
  //   </div>
  // );
};

export default LoginSignUpCognito;
