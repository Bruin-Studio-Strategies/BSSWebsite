import { FaInstagram, FaSlack, FaLinkedin } from 'react-icons/fa';

import logo from "../assets/logo.png";
import FooterItem from "./FooterItem";

export default function Footer() {
  return <footer className="w-full bg-[#232253] absolute bottom-0 h-28 px-10 py-10 flex">
    <img src={logo} alt="Logo" className="h-14 mr-5 ml-10" />
    <FooterItem>Home</FooterItem>
    <FooterItem>About Us</FooterItem>
    <FooterItem>Services</FooterItem>
    <FooterItem>Contact</FooterItem>
    <FooterItem>Join Us</FooterItem>
    <div className='flex justify-center space-x-6 ml-auto mt-2'>
      <a className='rounded-full border-white border h-10 w-10 flex items-center hover:cursor-pointer'>
        <FaInstagram className='fill-white h-6 w-6 block m-auto'/>
      </a>
      <a className='rounded-full border-white border h-10 w-10 flex items-center hover:cursor-pointer'>
        <FaSlack className='fill-white h-6 w-6 block m-auto'/>
      </a>
      <a className='rounded-full border-white border h-10 w-10 flex items-center hover:cursor-pointer'>
        <FaLinkedin className='fill-white h-6 w-6 block m-auto'/>
      </a>
    </div>
  </footer>;
}
