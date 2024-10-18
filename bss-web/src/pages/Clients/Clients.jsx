import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Services from "./sections/Services";
import Process from "./sections/Process";
import { Link } from "react-router-dom";

export default function Clients() {
  return (
    <>
      <div className="flex flex-col items-center mt-5 sm:mt-10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white text-center tracking-wider">
          Work With BSS
        </h2>
        <p className="text-center text-wrap w-5/6 sm:w-1/2 mt-5 font-sans sm:text-base text-sm">
          Bruin Studio Strategies provides honed expertise across various
          sectors in the entertainment industry, supplying tailored consulting
          services for creative and business ventures.
        </p>
      </div>
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <Services />
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <div className="w-4/5 mx-auto flex gap-20 flex-col sm:flex-row sm:mb-0 mb-32">
        <div className="w-11/12 sm:w-2/3 sm:mr-5 text-center sm:text-left sm:mx-0 mx-auto">
          <h3 className="text-3xl font-serif sm:mb-4 font-medium">
            Project Process
          </h3>
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
            <div className="mt-14">
              <h3 className="text-3xl font-serif sm:mb-4 font-medium">
                Get Started
              </h3>
              <p className="font-medium text-white">
                Ready to receive our services?
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
      <Footer />
    </>
  );
}
