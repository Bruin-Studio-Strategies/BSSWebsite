import logo from "../assets/logo-plain.png";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Title() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);

  return (
    <motion.div className="absolute top-40 right-52 z-10" style={{ rotate }}>
      <img src={logo} alt="Logo" className="h-[32rem] w-[32rem]"></img>
    </motion.div>
  );
}
