import Title from "./sections/Title";
import Footer from "./components/Footer";
import Info from "./sections/Info";
import NavBar from "./components/NavBar"
import Team from "./sections/Team";

import waves from "./assets/waves.png"

function App() {
  return (
    <>
      <NavBar />
      <Title/>
      <img src ={waves} className="w-full absolute"></img>
      <Info/>
      <Team/>
      <Footer/>
    </>
  );
}

export default App;
