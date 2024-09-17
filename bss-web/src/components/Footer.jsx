import logo from "../assets/logo.png";

export default function Footer() {
  return <footer className="w-full bg-[#232253] absolute bottom-0 h-36 px-10 py-10">
    <img src={logo} alt="Logo" className="h-14 mr-5" />
  </footer>;
}
