import "./App.css";
import Header from "./components/Header";
import MainBackGround from "./components/MainBackGround";
import SideBar from "./components/SideBar";
import "./reset.css";

function App() {
  return (
    <section className="App">
      <div>
        <Header />
        <MainBackGround />

        <SideBar />
      </div>
    </section>
  );
}

export default App;
