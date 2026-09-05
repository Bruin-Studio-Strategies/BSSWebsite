import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing.jsx";
import TeamPage from "./pages/TeamPage/TeamPage.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import Recruitment from "./pages/Recruitment/Recruitment.jsx";
import Clients from "./pages/Clients/Clients.jsx";
import NavBar from "./components/NavBar.jsx";
import PageTransition from "./transition/PageTransition.jsx";

// Every route used to carry its own copy of the same `motion.div` — six
// identical wrappers, so changing the transition meant editing it six times and
// a new route could silently ship without one. The transition is a property of
// the router, not of each page, so it lives in exactly one place now.
//
// `PageTransition` hands down a deferred location: the routes render against the
// page you can currently see, and only switch once the curtain is over them.
export default function App() {
  return (
    <Router>
      <NavBar />
      <PageTransition>
        {(location) => (
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        )}
      </PageTransition>
    </Router>
  );
}
