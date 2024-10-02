import NavItem from "./NavItem.jsx";
import Sidebar from "./SideBar.jsx";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && 
        <Sidebar toggleMenu={toggleMenu}></Sidebar>}
      </AnimatePresence>
      <nav className="w-full h-24 p-4 pl-8 pr-20">
        <div className="flex justify-start sm:gap-x-8 lg:gap-x-11 items-center text-xl">
          <button onClick={toggleMenu} className="sm:hidden">
            <svg
              className="h-8 w-8 mr-8 sm:mr-0 fill-white"
              viewBox="0 0 12 12"
            >
              <path d="M.5 5.5h11v1H.5zM.5 2.5h11v1H.5zM.5 8.5h11v1H.5z" />
            </svg>
          </button>
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 sm:h-12 lg:h-14 mr-5" />
          </Link>
          <NavItem path="/">Home</NavItem>
          <NavItem path="/clients">For Clients</NavItem>
          <NavItem path="/recruitment">For Students</NavItem>
          <NavItem path="/team">Our Team</NavItem>
          <NavItem path="/contact">Contact</NavItem>
          <NavItem className="ml-auto" path="/recruitment">
            Apply Now
          </NavItem>
        </div>
      </nav>
    </>
  );
}
