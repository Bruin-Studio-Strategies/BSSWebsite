import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavItem from "./NavItem.jsx";
import ApplyButton from "./ApplyButton.jsx";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { NAVIGATION } from "../content/site.js";

const EASE = [0.16, 1, 0.3, 1];

const mobileMenu = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const mobileItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

// The full row of links needs about 1000px: logo, five items at their gaps, and
// the Apply button pushed right. It used to switch on at `sm` (576px), and from
// there to roughly a small laptop the row did not fit — the logo image was
// squeezed to a sliver, "For Clients" / "For Students" / "Our Team" each broke
// onto two lines, and at 600px the Apply button ran off the edge. Tablets in
// portrait sit squarely in that range. The menu button now covers everything
// below `md` (960px), the same breakpoint the rest of the layout turns on.
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
        <button className="md:hidden" onClick={toggleMenu}>
          <svg className="h-8 w-8 mr-8 md:mr-0 fill-white" viewBox="0 0 12 12">
            <path d="M.5 5.5h11v1H.5zM.5 2.5h11v1H.5zM.5 8.5h11v1H.5z" />
          </svg>
        </button>
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Bruin Studio Strategies Logo" className="h-10 sm:h-12 lg:h-14 mr-8 sm:mt-0" />
        </Link>
        {/* nowrap so a label never breaks onto two lines; the tighter gap covers
            960–1024px, the one stretch where the row at its usual 48px spacing is
            about 50px wider than the space it has. */}
        <div className="justify-start whitespace-nowrap md:gap-x-8 min-[1024px]:gap-x-12 lg:gap-x-16 items-center w-full ml-5 mt-4 hidden md:flex">
          {NAVIGATION.map(({ path, label }) => (
            <NavItem key={path} path={path}>
              {label}
            </NavItem>
          ))}
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
            className="fixed top-0 left-0 z-50 h-full w-full bg-navy md:hidden"
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
              {/* "Home" alone carries text-lg, as it did when these were written
                  out by hand — the first item sets the menu's scale. */}
              {NAVIGATION.map(({ path, label }) => (
                <motion.li key={path} variants={mobileItem}>
                  <NavItem
                    path={path}
                    className={path === "/" ? "text-lg" : undefined}
                    onClick={toggleMenu}
                  >
                    {label}
                  </NavItem>
                </motion.li>
              ))}
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
