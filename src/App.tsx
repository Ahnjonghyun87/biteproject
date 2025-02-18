import "./App.css";
import SideBar from "./components/SideBar";
import Header from "./pages/Header";
import MainBackGround from "./pages/MainBackGround";
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
