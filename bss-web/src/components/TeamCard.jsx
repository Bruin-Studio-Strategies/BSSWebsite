import { motion } from "framer-motion";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function TeamCard({
  first,
  last,
  major,
  grad,
  role,
  image,
  linkedIn,
  email,
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative w-60 h-60 sm:w-[17rem] sm:h-[17rem]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={image}
          className="object-cover w-full h-full rounded-md"
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-md"
          whileHover={{ opacity: 1, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          initial={{ opacity: 0 }}
        >
          <div className="text-white text-center">
            <h5 className="font-serif font-thin text-2xl text-white tracking-wide mt-3">
              {first + " " + last}
            </h5>
            <p className="text-sm">{major + " " + grad}</p>
            <p className="text-sm">{role}</p>
            <div className="flex justify-center mt-3 space-x-2">
              {linkedIn && (
                <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-white" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`}>
                  <FaEnvelope className="text-white" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      <div className="sm:hidden">
        <h5 className="font-serif font-thin text-xl text-white tracking-wide mt-3 text-center">
          {first + " " + last}
        </h5>
        <p className="text-sm">{major + " " + grad}</p>
        <p className="text-sm">{role}</p>
        <div className="flex justify-center mt-3 space-x-2">
          {linkedIn && (
            <a href={linkedIn} target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-white" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`}>
              <FaEnvelope className="text-white" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
