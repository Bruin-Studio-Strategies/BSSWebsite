import { EXECUTIVES, CONSULTANTS, PRODUCT_MANAGERS } from "./people.js";

import Footer from "../../components/Footer.jsx";
import TeamCard from "../../components/TeamCard";
import TeamContainer from "../../components/TeamContainer.jsx";

export default function TeamPage() {
  return (
    <>
      <div className="flex flex-col items-center mt-5 sm:mt-10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white text-center tracking-wider">
          Meet Our Team
        </h2>
        <p className="text-center text-wrap w-5/6 sm:w-1/2 mt-5">
          Meet the team behind Bruin Studio Strategies. We come from a range of diverse backgrounds and experiences, but we all share a passion for creativity and innovation.  
        </p>
      </div>
      <hr className="fill-white w-1/2 sm:w-1/4 mx-auto my-12 opacity-45" />
      <div className="mb-80 sm:mb-48">
        <TeamContainer title="Executives">
          {EXECUTIVES.map((person) => (
            <TeamCard {...person} key={person.id}/>
          ))}
        </TeamContainer>
        
        {/* <TeamContainer title="Product Managers">
          {PRODUCT_MANAGERS.map((person) => (
            <TeamCard {...person} key={person.id}/>
          ))}
        </TeamContainer>
        <TeamContainer title="Consultants">
          {CONSULTANTS.map((person) => (
            <TeamCard {...person} key={person.id} />
          ))}
        </TeamContainer> */}
      </div>
      <Footer />
    </>
  );
}
