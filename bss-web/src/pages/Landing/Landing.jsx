import Title from "./sections/Title";
import Footer from "../../components/Footer";
import Info from "./sections/Info";
import NavBar from "../../components/NavBar";
import Team from "./sections/Team";

import Wave from "../../assets/waves.png"

export default function Landing() {
  return (
    <>
      <div className="relative h-screen">
        <NavBar />
        <Title />
        <img src={Wave} className="absolute top-60 w-full h-screen object-cover z-0"></img>
      </div>
      <Info />
      <hr class="h-px my-8 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <Team />
      <Footer />
    </>
  );
}
