import NavItem from "./NavItem.jsx";
import logo from "../assets/logo.png";

export default function NavBar() {
  return (
    <nav className="w-full h-24 p-4 pl-24 pr-20">
      <div className="flex justify-start gap-x-11 items-center text-xl">
        <svg className="h-8 w-8 fill-white" viewBox="0 0 12 12">
          <path d="M.5 5.5h11v1H.5zM.5 2.5h11v1H.5zM.5 8.5h11v1H.5z" />
        </svg>
        <img src={logo} alt="Logo" className="h-14 mr-5" />
        <NavItem>Home</NavItem>
        <NavItem>About Us</NavItem>
        <NavItem>Services</NavItem>
        <NavItem>Contact</NavItem>
        <NavItem className="ml-auto">Apply Now</NavItem>
      </div>
    </nav>
  );
}
