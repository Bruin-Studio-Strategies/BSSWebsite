export default function TimelineItem({
  time,
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
      <h3 className="text-xl font-medium font-serif text-white">
        {title}
      </h3>
      <p className="text-white font-sans text-sm font-medium my-1">{location} <span className="font-light font-sans text-gray-400">({attire})</span></p>
      <time className="text-sm font-sans leading-none font-light text-white">
        {time}
      </time>
      <p className="mb-4 text-base font-sans text-gray-400">
        {description}
      </p>
    </li>
  );
}
