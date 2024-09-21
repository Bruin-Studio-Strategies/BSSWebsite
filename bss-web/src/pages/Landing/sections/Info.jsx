import Feature from "../../../components/Feature";
import { SearchIcon, AnalysisIcon } from "../../../assets/svg";

export default function Info() {
  return(
  <>
    <h3 className="font-serif ml-28 my-20 text-4xl">What is BSS?</h3>
    <div className="grid grid-cols-[20%_80%] divide-x gap-y-32 pb-28">
      <h1 className="font-sans font-light text-lg text-white text-left pl-28">
        Who we are
      </h1>
      <p className="font-serif sm:text-xl lg:text-2xl px-28">
        Lorem ipsum odor amet, consectetuer adipiscing elit. Nibh mi etiam
        congue rutrum non quam semper. Vitae eleifend himenaeos parturient
        lobortis sodales dapibus pulvinar nullam tempus. Tortor mi vitae; quam
        blandit elit vitae morbi phasellus! Ultricies dolor vestibulum, purus
        libero tellus sapien tincidunt. Eu donec mollis turpis dictum vestibulum
        sit varius. Eu luctus faucibus mattis mus lectus non. Lectus nunc
        elementum proin habitant mi vel.
      </p>
      <h1 className="font-sans font-light text-lg text-white text-left pl-28 border-none">
        What we do
      </h1>
      <div className="grid grid-cols-3 px-28 gap-x-12 gap-y-28">
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
