import { FaCoffee, FaHandshake, FaRocket, FaClipboard } from "react-icons/fa";

import TimelineItem from "../../../components/TimelineItem";

export default function Timeline({ className }) {
  return (
    <ol className={"relative border-s-2 border-blue-800 " + className}>
      <TimelineItem
        title="Meet Bruin Studio Strategies"
        time="September 30th, 2024"
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. Varius amet cursus pellentesque ultrices netus nibh aptent fringilla. Torquent nibh rhoncus iaculis aptent, felis accumsan velit iaculis. Elementum senectus conubia mus dignissim arcu natoque nisl dapibus ultrices."
        location="Engineering IV Roof"
        attire="Business Casual"
        icon={<FaHandshake className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="The Launch Event"
        time="September 30th, 2024"
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. Varius amet cursus pellentesque ultrices netus nibh aptent fringilla. Torquent nibh rhoncus iaculis aptent, felis accumsan velit iaculis. Elementum senectus conubia mus dignissim arcu natoque nisl dapibus ultrices."
        location="Engineering IV Roof"
        attire="Business Casual"
        icon={<FaRocket className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Coffee Chats"
        time="September 30th, 2024"
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. Dui vestibulum dolor laoreet vestibulum mauris, adipiscing penatibus."
        location="Engineering IV Roof"
        attire="Business Casual"
        icon={<FaCoffee className="fill-white h-6 w-6 block" />}
      />
      <TimelineItem
        title="Final Interviews"
        time="September 30th, 2024"
        description="Lorem ipsum odor amet, consectetuer adipiscing elit. Varius amet cursus pellentesque ultrices netus nibh aptent fringilla. Torquent nibh rhoncus iaculis aptent, felis accumsan velit iaculis. Elementum senectus conubia mus dignissim arcu natoque nisl dapibus ultrices."
        location="Engineering IV Roof"
        attire="Business Casual"
        icon={<FaClipboard className="fill-white h-6 w-6 block" />}
      />
    </ol>
  );
}
