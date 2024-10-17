import ServiceCard from "../../../components/ServiceCard";
import { FaChartBar, FaChartLine, FaAward, FaChessKnight, FaDoorOpen, FaChess } from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";

export default function Services() {
  return (
    <section className="mx-auto mb-10 w-4/5">
      <h3 className="text-3xl font-serif sm:mb-4 font-medium mb-6 sm:text-left text-center">
        Our Services
      </h3>
      <div className="flex flex-wrap gap-y-8 sm:gap-3">
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Our team conducts thorough research to understand market trends, audience behaviors, and potential opportunities, enabling clients to make informed, data-driven decisions."
          icon={FaChartBar}
        ></ServiceCard>
        <ServiceCard
          title="Growth Strategy"
          className="bg-blue-950"
          description="We collaborate with clients to develop and implement tailored strategies for scaling their businesses effectively and sustainably within the entertainment industry."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Data Analytics"
          className="bg-blue-950"
          description="Leveraging advanced data tools, we analyze key business metrics and trends to offer insights that drive smarter, evidence-based decisions."
          icon={FaMagnifyingGlassChart}
        ></ServiceCard>
        <ServiceCard
          title="Brand Strategy"
          className="bg-blue-950"
          description="We develop compelling brand strategies that establish and reinforce a company’s unique identity, ensuring long-term brand recognition and loyalty."
          icon={FaAward}
        ></ServiceCard>
        <ServiceCard
          title="Competitive Analysis"
          className="bg-blue-950"
          description="We provide in-depth analysis of competitors' strategies, identifying opportunities and gaps to give our clients an advantage in a crowded market."
          icon={FaChessKnight}
        ></ServiceCard>
        <ServiceCard
          title="Market Entry"
          className="bg-blue-950"
          description="We help companies navigate new markets by providing detailed assessments and strategies for successful entry into new segments, maximizing growth opportunities."
          icon={FaDoorOpen}
        ></ServiceCard>
      </div>
    </section>
  );
}
