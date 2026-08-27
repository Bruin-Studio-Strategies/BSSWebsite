import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export default function ProcessCard({ title, period, description }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm transition-colors duration-200 hover:border-magenta/40 hover:bg-white/[0.05]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE }}
      whileHover={reducedMotion ? undefined : { x: 4 }}
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-sky mb-2">
        {period}
      </p>
      <h3 className="font-display text-xl sm:text-2xl text-white mb-2">{title}</h3>
      <p className="font-sans text-sm sm:text-base text-white/60 leading-relaxed">{description}</p>
    </motion.div>
  );
}
