import { Link } from "react-router-dom";
import group from "../../../assets/group.JPG";

export default function Team() {
  return (
    <div className="flex pb-96 sm:pb-60 w-full">
      <img
        src={group}
        alt="Bruin Studio Strategies group photo"
        className="hidden sm:inline sm:h-[50vh] lg:h-[40vh] sm:ml-24 lg:ml-40 sm:mt-20 rounded-md "
      />
      <div className="text-center sm:text-left sm:ml-28">
        <h3 className="font-serif mb-10 text-4xl">Our Team</h3>
        <p className="w-3/4 mx-auto sm:mx-0 sm:w-10/12 text-sm sm:text-base">
        At Bruin Studio Strategies, we are more than UCLA students—we are a community of innovators reshaping entertainment consulting. With diverse backgrounds in fields including data science, economics, policy, film, business, and computer science, our members bring diverse perspectives that blend analytical rigor with creative insight.
      <br/><br/>We pride ourselves on fostering a free-flowing and creative environment where innovative ideas flourish, turning market research and unique ideas into actionable strategies. Driven through innovation, our team delivers bold solutions that push the boundaries of the entertainment industry.

        </p>
        <h4 className="font-serif mt-10 text-xl">Join Us</h4>
        <p className="my-5 px-10 sm:px-0">
          Our application for Fall 2025 is live.
        </p>
        <Link to="https://forms.gle/xVDESkpmkP4MtpHm6?fbclid=PAZXh0bgNhZW0CMTEAAadFbpo77M3Dkz2vW5t2s1JFopI-tHdqMWIHL94-D59BH2cufaXQy7bJv9014w_aem_RXmJvNtWU_Pw87TpkvdRGQ">
          <button className="text-white bg-blue-900 hover:bg-blue-800 rounded-sm p-2">
            Apply Now
          </button>
        </Link>
      </div>
    </div> 
  );
}
//<Link to="/recruitment"> for offseason on line 23