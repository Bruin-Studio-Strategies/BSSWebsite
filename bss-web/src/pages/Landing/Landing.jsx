import Title from "./sections/Title";
import Footer from "../../components/Footer";
import Info from "./sections/Info";
import NavBar from "../../components/NavBar";
import Team from "./sections/Team";

export default function Landing() {
  return (
    <>
      <NavBar />
      <div className="bg-[url('./assets/waves.png')] w-full bg-no-repeat absolute h-[50rem] bg-cover z-10"></div>
      <div className="">
        <Title />
      </div>
      <Info />
      <Team />
      <Footer />
    </>
  );
}

