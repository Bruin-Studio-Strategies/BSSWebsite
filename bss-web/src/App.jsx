import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./pages/Landing/Landing.jsx";
import TeamPage from "./pages/TeamPage/TeamPage.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import Recruitment from "./pages/Recruitment/Recruitment.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import NavBar from "./components/NavBar.jsx";

import { useEffect } from "react"; 
import Footer from "./components/Footer.jsx";

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  duration: 0.5,
};

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function AnimatedRoutes() {
  const location = useLocation(); // This tracks the current path

  useEffect(() => {
    // Scroll to the top whenever the route changes
    scrollToTop();
  }, [location.pathname]); // Depend on location pathname changes

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={scrollToTop} // Scrolls to top after exit animation is done
    >
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/team"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TeamPage />
            </motion.div>
          }
        />
        <Route
          path="/contact"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Contact />
            </motion.div>
          }
        />
        <Route
          path="/clients"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Clients />
            </motion.div>
          }
        />
        <Route
          path="/recruitment"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Recruitment />
            </motion.div>
          }
        />
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ErrorPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
