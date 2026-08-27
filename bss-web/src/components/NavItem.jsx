import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

// Parent drives "rest"/"hover" via whileHover; the underline just listens
// for the same variant name, so hovering anywhere over the label (not just
// the 1px line itself) draws it in.
const underline = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
  active: { scaleX: 1 },
};

export default function NavItem({ className, path, children, onClick }) {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link to={path} onClick={onClick} className={className}>
      <motion.span
        initial="rest"
        whileHover="hover"
        animate={isActive ? "active" : "rest"}
        className="relative inline-block font-sans text-sm text-white/80 transition-colors duration-200 hover:text-white lg:text-base"
      >
        {children}
        <motion.span
          aria-hidden="true"
          variants={underline}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute -bottom-1.5 left-0 h-px w-full origin-left bg-sky"
        />
      </motion.span>
    </Link>
  );
}
