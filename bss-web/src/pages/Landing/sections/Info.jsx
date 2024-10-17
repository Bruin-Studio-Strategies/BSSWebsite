import Feature from "../../../components/Feature";
import { SearchIcon, AnalysisIcon } from "../../../assets/svg";

export default function Info() {
  return (
    <>
      <h3 className="font-serif text-center sm:text-start sm:ml-28 sm:my-20 text-4xl mb-8">
        What is BSS?
      </h3>
      <div className="grid sm:grid-cols-[20%_80%] sm:divide-x sm:gap-y-32 sm:pb-28 text-center sm:text-left">
        <h1 className="font-medium font-sans sm:font-light text-lg text-white sm:pl-28">
          Who we are
        </h1>
        <p className="font-sans text-sm sm:font-serif sm:text-xl lg:text-2xl sm:px-16 px-10">
          Bruin Studio Strategies (BSS @UCLA) is UCLA’s first premier
          entertainment consulting group, committed to pioneering the
          intersection of policy analytics, technology, and strategic consulting
          within the entertainment industry. More than just a club, we operate
          like a business start-up, providing consulting services to companies
          in the Los Angeles area. Our mission is to empower emerging
          undergraduate student leaders by offering immersive learning
          experiences and training. By bridging academic rigor with real-world
          application, we equip our members with the skills and insights
          necessary to thrive in the dynamic and competitive landscape of
          Hollywood and beyond.
        </p>
        <h1 className="font-sans font-medium sm:font-light text-lg text-white sm:text-left sm:pl-28 mb-5 sm:mb-0 mt-16 sm:mt-0 border-none">
          What we do
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 px-16 gap-x-12 gap-y-10 sm:gap-y-28">
          <Feature
            className=""
            description="Our team conducts thorough research to understand market trends, audience behaviors, and potential opportunities, enabling clients to make informed, data-driven decisions."
            title="Market Research"
            icon={AnalysisIcon}
          />
          <Feature
            className=""
            description="We collaborate with clients to develop and implement tailored strategies for scaling their businesses effectively and sustainably within the entertainment industry."
            title="Growth Strategy"
            icon={SearchIcon}
          />
          <Feature
            className=""
            description="Leveraging advanced data tools, we analyze key business metrics and trends to offer insights that drive smarter, evidence-based decisions."
            title="Data Analytics"
            icon={AnalysisIcon}
          />
          <Feature
            className=""
            description="We develop compelling brand strategies that establish and reinforce a company’s unique identity, ensuring long-term brand recognition and loyalty."
            title="Brand Strategy"
            icon={SearchIcon}
          />
          <Feature
            className=""
            description="We provide in-depth analysis of competitors' strategies, identifying opportunities and gaps to give our clients an advantage in a crowded market."
            title="Competitive Analysis"
            icon={AnalysisIcon}
          />
          <Feature
            className=""
            description="We help companies navigate new markets by providing detailed assessments and strategies for successful entry into new segments, maximizing growth opportunities."
            title="Market Entry"
            icon={SearchIcon}
          />
        </div>
      </div>
    </>
  );
}
