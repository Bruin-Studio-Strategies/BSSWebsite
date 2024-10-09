export default function Feature({ className, title, description, icon }) {
  return (
    <div className={className + " flex text-left"}>
      <div className="bg-purple p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 mr-5">{icon}</div>
      <div>
        <h2 className="font-serif sm:text-xl lg:text-2xl mb-2 font-medium text-white text-wrap">
          {title}
        </h2>
        <p className="lg:text-lg text-sm">{description}</p>
      </div>
    </div>
  );
}
