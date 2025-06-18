import { motion } from 'framer-motion';

export default function ServiceCard({ title, description, className, icon: Icon }) {
  return (
    <motion.div
      className={`flex flex-col w-72 h-80 rounded-2xl shadow-xl overflow-hidden mx-auto sm:mx-0`}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(37,59,134,0.18)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Top color block */}
      <div className={`flex flex-col items-center justify-center h-1/3 min-h-[100px] w-full ${className}`}>
        <Icon className="text-white w-9 h-9 mb-2" />
        <h4 className="text-lg font-semibold text-white text-center">{title}</h4>
      </div>
      {/* Bottom white block */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-4 w-full">
        <p className="text-center text-gray-800 text-base leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
