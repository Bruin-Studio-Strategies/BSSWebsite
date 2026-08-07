import Title from "./sections/Title";
import Footer from "../../components/Footer";
import Info from "./sections/Info";
import Team from "./sections/Team";
import HeroBackdrop from "../../components/HeroScene/HeroBackdrop";



export default function Landing() {
  return (
    <>
      <div className="relative h-screen overflow-hidden">
        <Title />
        <HeroBackdrop />
      </div>
      <Info />
      <hr className="h-px my-16 sm:my-24 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <Team />
      <Footer />
    </>
  );
}
