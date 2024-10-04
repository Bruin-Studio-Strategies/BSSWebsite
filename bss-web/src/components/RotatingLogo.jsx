import logo from "../assets/logo-plain.png";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Title() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <motion.div className="hidden sm:block absolute sm:top-12 sm:right-44 xl:right-66 z-0" style={{ rotate }}>
      <img src={logo} alt="Logo" className="h-[55vh] w-[55vh]"></img>
    </motion.div>
  );
}
