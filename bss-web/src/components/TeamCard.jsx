import { motion } from "framer-motion";
import { FaLink, FaLinkedin } from "react-icons/fa";

export default function TeamCard({
  first,
  last,
  major,
  grad,
  role,
  image,
  linkedIn,
  email
}) {
  return (
    <div className="flex flex-col">
      <div className="group relative">
        <motion.img
          src={image}
          className="object-cover w-80 h-80 mb-3 rounded-md"
          whileHover={{ scale: 1.05, opacity: 0.2 }}
        ></motion.img>
      </div>

      <h5 className="font-serif font-thin text-2xl text-white tracking-wide mb-1">
        {first + " " + last}
      </h5>
      <p className="text-sm">{major + " " + grad}</p>
      <p className="text-sm">{role}</p>
    </div>
  );
}
