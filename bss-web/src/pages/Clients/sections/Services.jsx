import ServiceCard from "../../../components/ServiceCard";
import { FaChartLine, FaRegLightbulb, FaRegNewspaper } from "react-icons/fa";

export default function Services() {
  return (
    <section className="mx-auto mb-10 w-4/5">
      <h3 className="text-3xl font-serif sm:mb-4 font-medium mb-6">Our Services</h3>
      <div className="flex flex-wrap gap-y-8 sm:gap-y-1 sm:gap-1">
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
