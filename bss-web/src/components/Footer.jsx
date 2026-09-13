import { motion, useReducedMotion } from "framer-motion";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo-plain.png";
import FooterItem from "./FooterItem";

const EASE = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const viewport = { once: true, amount: 0.6 };

export default function Footer() {
  const reducedMotion = useReducedMotion();

  return (
    // Absolutely positioned (not in normal flow) at a fixed height — every page that
    // renders this hand-tunes its own bottom padding/margin to leave clearance for it,
    // so this height must stay in sync with those (see Team.jsx, Contact.jsx, etc).
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={stagger}
      // Below sm this is a centred stack; `items-center` was missing, so the
      // wordmark row sat hard against the left edge while everything under it
      // was centred, and the bar read as broken.
      className="absolute bottom-0 flex h-60 w-full flex-col items-center justify-center gap-5 border-t border-white/10 bg-navy px-6 pb-8 pt-8 sm:h-24 sm:flex-row sm:items-center sm:gap-0 sm:px-10 sm:py-0"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 sm:mr-10">
        <img src={logo} alt="" className="h-6 w-6 opacity-80" />
        <span className="font-display text-sm text-white/70">Bruin Studio Strategies</span>
      </motion.div>

      {/* Wrapped rather than stacked on mobile. Five links in a single column
          needed about 300px and this bar is a fixed 240px, so the social icons
          were pushed out of the bottom of it. Two wrapped rows fit.

          The 17rem cap is what makes those two rows 3 + 2 rather than 4 + 1.
          Left to the full width the row fits four links and drops "Contact"
          underneath on its own, which reads as an accident; 17rem is just under
          the width of Home + For Clients + For Students at their gap, so the
          break lands after the third and `justify-center` centres both rows. */}
      <motion.div
        variants={fadeUp}
        className="flex max-w-[17rem] flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:max-w-none sm:flex-nowrap sm:gap-x-8"
      >
        <FooterItem path="/">Home</FooterItem>
        <FooterItem path="/clients">For Clients</FooterItem>
        <FooterItem path="/recruitment">For Students</FooterItem>
        <FooterItem path="/team">Our Team</FooterItem>
        <FooterItem path="/contact">Contact</FooterItem>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 sm:ml-auto">
        <motion.a
          whileHover={reducedMotion ? undefined : { scale: 1.1, rotate: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-200 hover:border-magenta hover:text-magenta"
          href="https://www.instagram.com/bruinstudiostrategies/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bruin Studio Strategies on Instagram"
        >
          <FaInstagram className="h-4 w-4" />
        </motion.a>
        <motion.a
          whileHover={reducedMotion ? undefined : { scale: 1.1, rotate: 8 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors duration-200 hover:border-sky hover:text-sky"
          href="https://www.linkedin.com/company/bruin-studio-strategies"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bruin Studio Strategies on LinkedIn"
        >
          <FaLinkedin className="h-4 w-4" />
        </motion.a>
      </motion.div>
    </motion.footer>
  );
}
