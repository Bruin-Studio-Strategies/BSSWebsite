export default function Feature({ className, title, description, icon: Icon }) {
  return (
    <div className={className + " flex text-left"}>
      <div className="bg-purple p-2 sm:p-3 rounded-full w-8 h-8 sm:w-12 sm:h-12 mr-5 flex items-center justify-center">
        <Icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <h2 className="font-serif sm:text-xl lg:text-2xl mb-2 font-medium text-white text-wrap">
          {title}
        </h2>
        <p className="lg:text-lg text-sm">{description}</p>
      </div>
    </div>
  );
}
