import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Services from "./sections/Services";
import Process from "./sections/Process";
import { Link } from "react-router-dom";

export default function Clients() {
  return (
    <>
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
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <div className="w-4/5 mx-auto flex gap-20">
        <div className="w-2/3 mr-5">
          <h3 className="text-3xl font-serif sm:mb-4 font-medium">Project Process</h3>
          <p className="text-wrap my-5">
            Throughout a 8-week timeframe, we can provide impactful deliverables
            to clients.
          </p>
          <div>
            <p className="text-white font-medium font-sans">
              Each project includes:
            </p>
            <p>
              2 Project Managers <br />
              4-5 Consultants
            </p>
            <img
              src="https://via.placeholder.com/600x400"
              alt="placeholder"
              className="my-10"
            />
            <div>
              <h3 className="text-3xl font-serif sm:mb-4 font-medium">Get Started</h3>
              <p className="font-medium text-white">
                Ready to start your project?
              </p>
              <p className="text-wrap my-5">
                Email us at{" "}
                <span className="text-blue-400">
                  bruinstudiostrategies@gmail.com{" "}
                </span>
                or fill out or contact form below
              </p>
              <Link to="/contact" className="text-blue-950">
                <button className="text-white bg-blue-900 hover:bg-blue-800 rounded-sm p-2">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Process />
      </div>
    </>
  );
}
