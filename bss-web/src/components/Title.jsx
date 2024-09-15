import Hero from "./Hero.jsx";
import logo from "../assets/logo-plain.png"

export default function Title() {
  return (
    <div className="px-40 py-40">
      <Hero />
      <img src={logo} alt="Logo" className="h-[35rem] w-[35rem] absolute top-28 right-52"></img>
    </div>
  );
}
