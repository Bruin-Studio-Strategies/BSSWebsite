import Feature from "../components/Feature"

import { SearchIcon, AnalysisIcon } from "../assets/svg"

export default function Figures(){

  return <div className="grid grid-cols-6 mt-40 divide-x gap-y-32">
    <h1 className="font-sans font-light text-lg text-white col-span-1 text-left pl-40">Who we are</h1>
    <p className="col-span-5 font-serif text-2xl px-28">Lorem ipsum odor amet, consectetuer adipiscing elit. Nibh mi etiam congue rutrum non quam semper. Vitae eleifend himenaeos parturient lobortis sodales dapibus pulvinar nullam tempus. Tortor mi vitae; quam blandit elit vitae morbi phasellus! Ultricies dolor vestibulum, purus libero tellus sapien tincidunt. Eu donec mollis turpis dictum vestibulum sit varius. Eu luctus faucibus mattis mus lectus non. Lectus nunc elementum proin habitant mi vel.</p>
    <h1 className="font-sans font-light text-lg text-white col-span-1 text-left pl-40 border-none">What we do</h1>
    <div className="grid grid-cols-3 col-span-5 px-28 gap-x-10 gap-y-28">
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales." title="Competitive Analysis" icon={AnalysisIcon}/>
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit." title="Market Research" icon={SearchIcon}/>
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales." title="Competitive Analysis" icon={AnalysisIcon}/>
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit." title="Market Research" icon={SearchIcon}/>
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit. Vitae eleifend himenaeos parturient lobortis sodales." title="Competitive Analysis" icon={AnalysisIcon}/>
      <Feature className="" description="Lorem ipsum odor amet, consectetuer adipiscing elit." title="Market Research" icon={SearchIcon}/>
    </div>
  </div>
}