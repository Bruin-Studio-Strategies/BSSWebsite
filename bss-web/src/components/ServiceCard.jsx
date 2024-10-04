export default function ServiceCard({ title, description, className, icon:Icon }) {
  return (
    <div className={`flex flex-col sm:w-60 sm:h-56 lg:w-80 lg:h-72 gap-2 lg:p-6 ${className} rounded-sm p-4 hover:border border-gray-200`}>
      <div className="">
        <Icon className="text-white sm:w-5 sm:h-5 lg:w-7 lg:h-7"/>
      </div>
      <h4 className="text-xl font-medium sm:text-xl lg:text-2xl text-white font-sans">{title}</h4>
      <p className="sm:text-sm lg:text-base">{description}</p>
    </div>
  );
}
