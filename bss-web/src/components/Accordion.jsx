import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSortDown, FaSortUp } from "react-icons/fa";


export default function Accordion({ title, children }) {
  const [active, setActive] = useState(false);

  function handleClick() {
    setActive((a) => !a);
  }

  return (
    <div>
      <button
        className="sm:text-xl w-full p-4 bg-blue-950 text-left text-lg font-medium font-serif text-white rounded-sm flex justify-between items-center"
        onClick={handleClick}
      >
        {title} {active ? <FaSortDown className="mb-2"/> : <FaSortUp className="mt-2"/>}
      </button>
      <motion.div>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-2 pt-4 pb-2 text-white rounded-b-sm font-sans font-light text-sm"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
    </div>
  );
}
