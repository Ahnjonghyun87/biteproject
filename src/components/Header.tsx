import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <div className="title">비트코인-이더리움 앱</div>
        <div className="login">
          <span>로그인</span>
          <span>회원가입</span>
          <span>로그아웃</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
