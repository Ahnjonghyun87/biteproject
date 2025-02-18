import "./Header.css";

const Header = () => {
  const handleMoveLogin = () => {};

  const handleMoveSignUp = () => {};

  const handleLogOut = () => {};

  return (
    <div className="header">
      <div className="container">
        <div className="title">비트코인-이더리움 앱</div>
        <div className="login">
          <button onClick={handleMoveLogin}>LogIn</button>

          <button onClick={handleMoveSignUp}>SignUp</button>
          <button onClick={handleLogOut}>LogOut</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
