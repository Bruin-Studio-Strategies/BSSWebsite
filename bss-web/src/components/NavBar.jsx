import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavItem from "./NavItem.jsx";
import ApplyButton from "./ApplyButton.jsx";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

const EASE = [0.16, 1, 0.3, 1];

const mobileMenu = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const mobileItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-20 w-full h-24 p-4 pl-8 pr-20 flex items-center"
      >
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
          <ApplyButton variant="outline" className="ml-auto" />
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 z-50 h-full w-full bg-navy sm:hidden"
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleMenu}>
                <MdClose className="fill-white"/>
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="show"
              variants={mobileMenu}
              className="flex flex-col items-center pt-20 h-full space-y-8 text-white"
            >
              <motion.li variants={mobileItem}>
                <NavItem path="/" className="text-lg" onClick={toggleMenu}>Home</NavItem>
              </motion.li>
              <motion.li variants={mobileItem}>
                <NavItem path="/clients" onClick={toggleMenu}>For Clients</NavItem>
              </motion.li>
              <motion.li variants={mobileItem}>
                <NavItem path="/recruitment" onClick={toggleMenu}>For Students</NavItem>
              </motion.li>
              <motion.li variants={mobileItem}>
                <NavItem path="/team" onClick={toggleMenu}>Our Team</NavItem>
              </motion.li>
              <motion.li variants={mobileItem}>
                <NavItem path="/contact" onClick={toggleMenu}>Contact</NavItem>
              </motion.li>
              <motion.li variants={mobileItem}>
                <ApplyButton variant="outline" onClick={toggleMenu} />
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
