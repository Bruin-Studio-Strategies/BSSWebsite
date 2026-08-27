import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const underline = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
  active: { scaleX: 1 },
};

export default function FooterItem({ className, path, children }) {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link to={path} className={className}>
      <motion.span
        initial="rest"
        whileHover="hover"
        animate={isActive ? "active" : "rest"}
        className="relative inline-block font-sans text-sm text-white/60 transition-colors duration-200 hover:text-sky"
      >
        {children}
        <motion.span
          aria-hidden="true"
          variants={underline}
          transition={{ duration: 0.3, ease: EASE }}
          className="absolute -bottom-1 left-0 h-px w-full origin-left bg-sky"
        />
      </motion.span>
    </Link>
  );
}
