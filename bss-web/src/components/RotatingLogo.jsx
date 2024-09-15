import logo from "../assets/logo-plain.png";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Title() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <motion.dv className="absolute top-32 right-52" style={{ rotate }}>
      <img src={logo} alt="Logo" className="h-[37rem] w-[37rem]"></img>
    </motion.dv>
  );
}
