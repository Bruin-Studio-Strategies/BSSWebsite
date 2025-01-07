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
          At Bruin Studio Strategies, our team is more than just a collection of
          UCLA students—it's a community of driven individuals, each bringing
          their own unique talents and passions to the table. United by our
          commitment to redefining the entertainment consulting space, our
          members come from a diverse range of academic disciplines, including
          data science, economics, policy, film, business, and media studies.
          This diversity allows us to tackle complex industry challenges from
          multiple angles, combining analytical rigor with creative thinking. 
          <br/><br/>
          We pride ourselves on fostering an environment where innovative ideas
          flourish, and collaboration is at the heart of everything we do.
          Whether it’s dissecting the latest market trends, developing strategic
          insights, or providing cutting-edge data analytics, our team is
          dedicated to delivering results that push boundaries in the
          entertainment industry.
        </p>
        <h4 className="font-serif mt-10 text-xl">Join Us</h4>
        <p className="my-5 px-10 sm:px-0">
          Our next recruitment cycle will be in Winter 2025
        </p>
        <Link to="/recruitment">
          <button className="text-white bg-blue-900 hover:bg-blue-800 rounded-sm p-2">
            More Details
          </button>
        </Link>
      </div>
    </div>
  );
}
