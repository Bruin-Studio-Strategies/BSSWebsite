import Timeline from "./sections/Timeline";
import FAQ from "./sections/FAQ";
import Footer from "../../components/Footer";

export default function Recruitment() {
  // structure:
  // header
  // timeline
  // faq
  //
  return (
    <>
      <div className="flex flex-col items-center mt-5 sm:mt-10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white text-center tracking-wider">
          Join Our Team
        </h2>
        <p className="text-center text-wrap w-5/6 sm:w-1/2 mt-5 font-sans sm:text-base text-sm">
          Interested in joining our team? Fall 2024 applications are now live!
        </p>
      </div>
      <hr className="h-px my-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <div className="w-full sm:w-4/5 mx-auto sm:px-0 px-3">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-6 sm:mb-10 sm:text-left text-center">
          Recruiment Timeline
        </h3>
        <Timeline className="ml-10" />
      </div>

      <div className="bg-blue-900 p-6 pb-10 sm:p-10 text-center my-16 sm:my-20">
        <h3 className="text-2xl sm:text-3xl font-serif font-medium">
          Applications Are Open
        </h3>
        <p className="w-11/12 sm:w-3/4 mx-auto my-5 font-sans text-sm sm:text-base">
          Winter 2025 Applications are Live!
        </p>
        <a className="text-blue-900 bg-white rounded-sm font-sans p-2 hover:opacity-75 transition-opacity" href="https://forms.gle/FV2C9Ahamki44ZaN9">
          Apply Here
        </a>
      </div>

      <div className="w-11/12 sm:w-4/5 mx-auto flex sm:flex-row flex-col sm:mb-0 mb-36">
        <div className="w-11/12 sm:w-2/3 sm:mx-0 mx-auto sm:text-left text-center sm:mb-0 mb-12">
          <h3 className="font-serif text-3xl font-medium mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-white text-sm sm:text-base font-sans sm:w-3/4 w-full">
            Interested in joining Bruin Studio Strategies or learning more about
            our process? We’ve answered some of the most common questions below
            to help you get started.
          </p>
        </div>
        <FAQ />
      </div>
      <Footer />
    </>
  );
}
