import { FaInstagram, FaSlack, FaLinkedin } from "react-icons/fa";

import FooterItem from "./FooterItem";

export default function Footer() {
  return (
    <footer className="w-full bg-[#07092c] absolute bottom-0 h-60 sm:h-24 sm:px-10 pt-10 pb-20 flex">
      <div className="flex flex-col sm:flex-row">
        <FooterItem path="/">Home</FooterItem>
        <FooterItem path="/clients">For Clients</FooterItem>
        <FooterItem path="/recruitment">For Students</FooterItem>
        <FooterItem path="/team">Our Team</FooterItem>
        <FooterItem path="/contact">Contact</FooterItem>
      </div>

      <div className="flex justify-center sm:space-x-6 space-y-3 sm:space-y-0 mx-auto sm:mx-0 sm:ml-auto mt-2 flex-col sm:flex-row">
        <a className="rounded-full border-white sm:border h-10 w-10 flex items-center hover:cursor-pointer">
          <FaInstagram className="fill-white h-6 w-6 block m-auto" />
        </a>
        <a className="rounded-full border-white sm:border h-10 w-10 flex items-center hover:cursor-pointer">
          <FaSlack className="fill-white h-6 w-6 block m-auto" />
        </a>
        <a className="rounded-full border-white sm:border h-10 w-10 flex items-center hover:cursor-pointer">
          <FaLinkedin className="fill-white h-6 w-6 block m-auto" />
        </a>
      </div>
    </footer>
  );
}
