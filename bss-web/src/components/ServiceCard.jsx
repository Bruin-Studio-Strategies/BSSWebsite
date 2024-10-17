import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ServiceCard({ title, description, className, icon: Icon }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className={`relative flex mx-auto sm:mx-0 flex-col w-60 h-56 sm:w-60 sm:h-56 lg:w-80 lg:h-72 gap-2 lg:p-6 ${className} rounded-sm p-4 bg-[#253b86] drop-shadow-md shadow-lg`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <motion.div 
        className={`absolute inset-0 flex flex-col justify-center items-center`}
        initial={{ opacity: 1, rotateY: 0 }}
        animate={{ opacity: isHovered ? 0 : 1, rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="text-white w-7 h-7 mb-2" />
        <h4 className="text-xl font-medium sm:text-xl lg:text-2xl text-white font-sans">{title}</h4>
      </motion.div>
      <motion.div
        className={`absolute inset-0 flex justify-center items-center p-8 text-sm sm:text-base sm:p-6`}
        initial={{ opacity: 0, rotateY: -180 }}
        animate={{ opacity: isHovered ? 1 : 0, rotateY: isHovered ? 0 : -180 }}
        transition={{ duration: 0.5 }}
      >
        <p className="sm:text-sm lg:text-base text-white">{description}</p>
      </motion.div>
    </motion.div>
  );
}
