import ServiceCard from "../../../components/ServiceCard";
import { FaChartLine, FaRegLightbulb, FaRegNewspaper } from "react-icons/fa";

export default function Services() {
  return (
    <section className="w-[89%] mx-auto">
      <h3 className="text-3xl font-serif sm:mb-4">Our Services</h3>
      <div className="flex flex-wrap gap-1">
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
        <ServiceCard
          title="Market Research"
          className="bg-blue-950"
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Sociosqu laoreet ultrices ligula; arcu nibh per litora. Ornare lacinia eu pretium consequat congue ultricies est."
          icon={FaChartLine}
        ></ServiceCard>
      </div>
    </section>
  );
}
