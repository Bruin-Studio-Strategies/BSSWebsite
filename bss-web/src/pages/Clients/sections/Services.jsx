import ServiceCard from "../../../components/ServiceCard";
import { FaChartBar, FaChartLine, FaAward, FaChessKnight, FaDoorOpen } from "react-icons/fa";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRef, useState } from "react";

const services = [
  {
    title: "Market Research",
    className: "bg-blue-950",
    description:
      "Our team conducts thorough research to understand market trends, audience behaviors, and potential opportunities, enabling clients to make informed, data-driven decisions.",
    icon: FaChartBar,
  },
  {
    title: "Growth Strategy",
    className: "bg-blue-950",
    description:
      "We collaborate with clients to develop and implement tailored strategies for scaling their businesses effectively and sustainably within the entertainment industry.",
    icon: FaChartLine,
  },
  {
    title: "Data Analytics",
    className: "bg-blue-950",
    description:
      "Leveraging advanced data tools, we analyze key business metrics and trends to offer insights that drive smarter, evidence-based decisions.",
    icon: FaMagnifyingGlassChart,
  },
  {
    title: "Brand Strategy",
    className: "bg-blue-950",
    description:
      "We develop compelling brand strategies that establish and reinforce a company's unique identity, ensuring long-term brand recognition and loyalty.",
    icon: FaAward,
  },
  {
    title: "Competitive Analysis",
    className: "bg-blue-950",
    description:
      "We provide in-depth analysis of competitors' strategies, identifying opportunities and gaps to give our clients an advantage in a crowded market.",
    icon: FaChessKnight,
  },
  {
    title: "Market Entry",
    className: "bg-blue-950",
    description:
      "We help companies navigate new markets by providing detailed assessments and strategies for successful entry into new segments, maximizing growth opportunities.",
    icon: FaDoorOpen,
  },
];

export default function Services() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 3, spacing: 24, origin: "center" },
    mode: "snap",
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    initial: 0,
    loop: true,
    breakpoints: {
      "(max-width: 900px)": {
        slides: { perView: 1, spacing: 0, origin: "center" },
      },
      "(min-width: 901px) and (max-width: 1200px)": {
        slides: { perView: 2, spacing: 24, origin: "center" },
      },
    },
  });

  return (
    <section className="mx-auto mb-10 w-4/5 max-w-6xl">
      <h3 className="text-3xl font-serif font-medium mb-10 text-center">
        Our Services
      </h3>
      <div className="relative mx-auto">
        {/* Carousel with Arrows */}
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-blue-900 text-white rounded-full p-2 shadow hover:bg-blue-800 transition disabled:opacity-50"
            onClick={() => instanceRef.current?.prev()}
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-blue-900 text-white rounded-full p-2 shadow hover:bg-blue-800 transition disabled:opacity-50"
            onClick={() => instanceRef.current?.next()}
            aria-label="Next"
          >
            &#8594;
          </button>
          <div ref={sliderRef} className="keen-slider max-w-4xl mx-auto">
            {services.map((service, idx) => (
              <div className="keen-slider__slide flex justify-center" key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full border-2 border-blue-900 transition ${currentSlide === idx ? "bg-blue-900" : "bg-white"}`}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
