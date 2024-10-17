import { motion } from "framer-motion";

export default function ProcessCard({ title, slogan, description }) {
  return (
    <motion.div
      className="p-4 w-full sm:w-5/6 bg-blue-950"
      whileHover={{
        scale: 1.05,
      }}
    >
      <h3 className="text-2xl font-serif font-medium sm:mb-4">{title}</h3>
      <p className="text-white font-light font-sans text-sm mb-1">{slogan}</p>
      <p className="mb-4 text-base font-sans text-gray-400">{description}</p>
    </motion.div>
  );
}
