import { EXECUTIVES, CONSULTANTS, PRODUCT_MANAGERS, ADVISORYBOARD } from "./people.js";

import Footer from "../../components/Footer.jsx";
import TeamCard from "../../components/TeamCard";
import TeamContainer from "../../components/TeamContainer.jsx";
import SectionDivider from "../../components/SectionDivider.jsx";

export default function TeamPage() {
  return (
    <>
      <div className="flex flex-col items-center mt-5 sm:mt-10">
        <h2 className="font-serif text-4xl sm:text-5xl text-white text-center tracking-wider">
          Meet Our Team
        </h2>
        <p className="text-center text-wrap w-5/6 sm:w-1/2 mt-5">
        Diverse, passionate, and innovative.
        </p>
      </div>
      <SectionDivider className="my-12" />
      <div className="mb-80 sm:mb-48">
        <TeamContainer title="Executives">
          {EXECUTIVES.map((person) => (
            <TeamCard {...person} key={person.id}/>
          ))}
        </TeamContainer>
        <TeamContainer title="Advisory Board">
          {ADVISORYBOARD.map((person) => (
            <TeamCard {...person} key={person.id}/>
          ))}
        </TeamContainer>
        
        {/* <TeamContainer title="Product Managers">
          {PRODUCT_MANAGERS.map((person) => (
            <TeamCard {...person} key={person.id}/>
          ))}
        </TeamContainer> */}
        <TeamContainer title="Consultants">
          {CONSULTANTS.map((person) => (
            <TeamCard {...person} key={person.id} />
          ))}
        </TeamContainer>
      </div>
      <Footer />
    </>
  );
}
