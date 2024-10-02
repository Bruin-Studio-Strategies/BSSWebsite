import Form from "./sections/Form";
import Footer from "../../components/Footer";

export default function Contact() {
  return (
    <>
      {/* add a banner here possibly? ask alli */}
      <div className="grid grid-cols-[40%_60%] sm:mt-10 lg:mt-28 sm:max-lg:mb-40 w-10/12 m-auto">
        <div className="flex flex-col">
          <h1 className="font-serif sm:text-5xl lg:text-7xl text-white font-medium text-wrap w-5/6 sm:mb-5">
            Interested in working with us?
          </h1>
          <p className="sm:mb-5 lg:text-lg">Whether you are a company, organization, or student on campus, we would love to get in touch with you</p>
          <p className="font-medium font-sans sm:mb-2 lg:text-lg">President: <span className="font-light font-sans">adriennelee@g.ucla.edu</span></p>
          <p className="font-medium font-sans sm:mb-2 lg:text-lg">Director of External: <span className="font-light font-sans">dlencyz@gmail.com</span></p>
          <p className="font-medium font-sans sm:mb-2 lg:text-lg">Director of Internal Relations: <span className="font-light font-sans">gisellecarlos@g.ucla.edu</span></p>
        </div>
        <div className="ml-20">
          <Form />
        </div>
      </div>
      <Footer />
    </>
  );
}
