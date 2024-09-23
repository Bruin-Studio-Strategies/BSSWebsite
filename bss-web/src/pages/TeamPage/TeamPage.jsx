import { EXECUTIVES, CONSULTANTS, PRODUCT_MANAGERS } from "./people.js";

import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer.jsx";
import TeamCard from "../../components/TeamCard";
import TeamContainer from "../../components/TeamContainer.jsx";

export default function TeamPage() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="font-serif text-5xl text-white text-center tracking-wider">
          Meet Our Team
        </h2>
        <p className="text-center text-wrap w-1/3 mt-5">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Condimentum mus
          maecenas erat pellentesque potenti elementum.
        </p>
      </div>
      <hr className="fill-white w-1/4 mx-auto my-12 opacity-45" />
      <div className="mb-48">
        <TeamContainer title="Executives">
          {EXECUTIVES.map((person) => (
            <TeamCard {...person} />
          ))}
        </TeamContainer>
        <TeamContainer title="Product Managers">
          {PRODUCT_MANAGERS.map((person) => (
            <TeamCard {...person} />
          ))}
        </TeamContainer>
        <TeamContainer title="Consultants">
          {CONSULTANTS.map((person) => (
            <TeamCard {...person} />
          ))}
        </TeamContainer>
      </div>
      <Footer />
    </>
  );
}
