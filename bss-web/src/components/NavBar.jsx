import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavItem from "./NavItem.jsx";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav className="w-full h-24 p-4 pl-8 pr-20 flex items-center">
        <button className="sm:hidden" onClick={toggleMenu}>
          <svg className="h-8 w-8 mr-8 sm:mr-0 fill-white" viewBox="0 0 12 12">
            <path d="M.5 5.5h11v1H.5zM.5 2.5h11v1H.5zM.5 8.5h11v1H.5z" />
          </svg>
        </button>
        <Link to="/">
          <img src={logo} alt="Bruin Studio Strategies Logo" className="h-10 sm:h-12 lg:h-14 mr-8 sm:mt-0" />
        </Link>
        <div className="justify-start sm:gap-x-12 lg:gap-x-16 items-center w-full ml-5 mt-4 hidden sm:flex">
          <NavItem path="/">Home</NavItem>
          <NavItem path="/clients">For Clients</NavItem>
          <NavItem path="/recruitment">For Students</NavItem>
          <NavItem path="/team">Our Team</NavItem>
          <NavItem path="/contact">Contact</NavItem>
          <NavItem className="ml-auto" path="">
            Apply Now
          </NavItem>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 w-full h-full bg-blue-950 z-50 sm:hidden"
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleMenu}>
                <MdClose className="fill-white"/>
              </button>
            </div>
            <ul className="flex flex-col items-center pt-20 h-full space-y-8 text-white">
              <li>
                <NavItem path="/" className="text-lg" onClick={toggleMenu}>Home</NavItem>
              </li>
              <li>
                <NavItem path="/clients" onClick={toggleMenu}>For Clients</NavItem>
              </li>
              <li>
                <NavItem path="/recruitment" onClick={toggleMenu}>For Students</NavItem>
              </li>
              <li>
                <NavItem path="/team" onClick={toggleMenu}>Our Team</NavItem>
              </li>
              <li>
                <NavItem path="/contact" onClick={toggleMenu}>Contact</NavItem>
              </li>
              <li>
                <NavItem path="/recruitment" onClick={toggleMenu} className="font-medium">Apply Now</NavItem>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
