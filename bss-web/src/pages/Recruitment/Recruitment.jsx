import NavBar from "../../components/NavBar";
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
      <NavBar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="font-serif text-5xl text-white text-center tracking-wider">
          Join Our Team
        </h2>
        <p className="text-center text-wrap w-1/2 mt-5">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Condimentum mus
          maecenas erat pellentesque potenti elementum. Lorem ipsum odor amet,
          consectetuer adipiscing elit. Condimentum mus maecenas erat
          pellentesque potenti elementum.
        </p>
      </div>
      <hr className="h-px mt-8 mb-12 bg-gray-100 border-0 w-11/12 m-auto opacity-50"></hr>
      <div className="w-4/5 mx-auto">
        <h3 className="font-serif text-3xl font-medium mb-10">
          Recruiment Timeline
        </h3>
        <Timeline className="ml-10" />
      </div>
      <div className="w-4/5 mx-auto flex">
        <div className="w-2/3">
          <h3 className="font-serif text-3xl font-medium mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-white text-sm font-sans w-3/4 ">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Varius amet
            cursus pellentesque ultrices netus nibh aptent fringilla. Torquent
            nibh rhoncus iaculis aptent, felis accumsan velit iaculis. Elementum
            senectus conubia mus dignissim arcu natoque nisl dapibus ultrices.
          </p>
        </div>

        <FAQ />
      </div>
      <Footer />
    </>
  );
}
