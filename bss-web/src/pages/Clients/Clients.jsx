import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Services from "./sections/Services";


export default function Clients() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="font-serif text-5xl text-white text-center tracking-wider">
          Work With BSS
        </h2>
        <p className="text-center text-wrap w-1/2 mt-5">
          Bruin Studio Strategies provides honed expertise across various
          sectors in the entertainment industry, supplying tailored consulting
          services for creative and business ventures.
        </p>
      </div>
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <Services />  
    </>
  );
}
