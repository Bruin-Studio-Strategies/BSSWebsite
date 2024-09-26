export default function TimelineItem({
  date,
  location,
  title,
  description,
  attire,
  icon,
}) {

  console.log(icon);
  return (
    <li className="mb-14 ms-10">
      <div className="absolute w-10 h-10 bg-blue-900 rounded-full -start-5 flex justify-center items-center">
        {icon}
      </div>
      <time className="mb-1 text-sm font-sans leading-none text-gray-500">
        {date}
      </time>
      <h3 className="text-xl font-medium font-serif text-white">
        {title}
      </h3>
      <p className="text-white font-light font-sans text-sm mb-1">{location} <span className="font-light font-sans text-gray-400">({attire})</span></p>
      <p className="mb-4 text-base font-sans text-gray-400">
        {description}
      </p>
    </li>
  );
}
