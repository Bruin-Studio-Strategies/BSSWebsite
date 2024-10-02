    import { MdClose } from "react-icons/md";
    import { motion } from "framer-motion";
    import SideItem from "./SideItem";
 
    export default function SideBar({toggleMenu}) {
    const menuVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
    };

    return (
        <motion.nav
        className="h-screen w-full items-center sm:w-1/5 p-4 pt-10 lg:pt-16 bg-blue-950 fixed top-0 z-30"
        variants={menuVariants}
        transition={{ duration: 0.5 }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        >
        <button className="absolute right-0 sm:top-5 sm:right-5" onClick={toggleMenu}>
            <MdClose className="sm:h-5 sm:w-5 lg:h-8 lg:w-8 fill-white" />
        </button>
        <div className="flex flex-col justify-start text-2xl sm:gap-y-10 lg:gap-y-20">
            <SideItem path="/">Home</SideItem>
            <SideItem path="/clients">For Clients</SideItem>
            <SideItem path="/recruitment">For Students</SideItem>
            <SideItem path="/team">Our Team</SideItem>
            <SideItem path="/contact">Contact</SideItem>
            <SideItem className="font-semibold sm:mt-28" path="/recruitment">
            Apply Now
            </SideItem>
        </div>
        </motion.nav>
    );
    }
