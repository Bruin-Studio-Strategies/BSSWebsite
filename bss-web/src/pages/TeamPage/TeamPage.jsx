import "../../index.css";

import NavBar from "../../components/NavBar";
import TeamCard from "../../components/TeamCard";

export default function TeamPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center">
        <h2 className="font-serif text-5xl text-white text-center mt-16 tracking-wider">
          Meet Our Team
        </h2>
        <p className="text-center text-wrap w-1/3 mt-5">Lorem ipsum odor amet, consectetuer adipiscing elit. Condimentum mus maecenas erat pellentesque potenti elementum.</p>
      </div>

      <div>
        <TeamCard firstName="Ethan" lastName="Huang"/>
      </div>
    </>
  );
}
