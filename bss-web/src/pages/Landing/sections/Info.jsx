import Feature from "../../../components/Feature";
import { SearchIcon, AnalysisIcon } from "../../../assets/svg";

export default function Info() {
  return(
  <>
    <h3 className="font-serif text-center sm:text-start sm:ml-28 sm:my-20 text-4xl mb-8">What is BSS?</h3>
    <div className="grid sm:grid-cols-[20%_80%] sm:divide-x sm:gap-y-32 sm:pb-28 text-center sm:text-left">
      <h1 className="font-medium font-sans sm:font-light text-lg text-white sm:pl-28">
        Who we are
      </h1>
      <p className="font-sans text-sm sm:font-serif sm:text-xl lg:text-2xl sm:px-16 px-10">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Nibh mi etiam
        congue rutrum non quam semper. Vitae eleifend himenaeos parturient
        lobortis sodales dapibus pulvinar nullam tempus. Tortor mi vitae; quam
        blandit elit vitae morbi phasellus! Ultricies dolor vestibulum, purus
        libero tellus sapien tincidunt. Eu donec mollis turpis dictum vestibulum
        sit varius. Eu luctus faucibus mattis mus lectus non. Lectus nunc
        elementum proin habitant mi vel.
      </p>
      <h1 className="font-sans font-medium sm:font-light text-lg text-white sm:text-left sm:pl-28 mb-5 sm:mb-0 mt-16 sm:mt-0 border-none">
        What we do
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 px-16 gap-x-12 gap-y-10 sm:gap-y-28">
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales."
          title="Competitive Analysis"
          icon={AnalysisIcon}
        />
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit."
          title="Market Research"
          icon={SearchIcon}
        />
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales."
          title="Competitive Analysis"
          icon={AnalysisIcon}
        />
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit."
          title="Market Research"
          icon={SearchIcon}
        />
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales."
          title="Competitive Analysis"
          icon={AnalysisIcon}
        />
        <Feature
          className=""
          description="Lorem ipsum odor amet, consectetuer adipiscing elit."
          title="Market Research"
          icon={SearchIcon}
        />
      </div>
    </div>
  </>);
}
