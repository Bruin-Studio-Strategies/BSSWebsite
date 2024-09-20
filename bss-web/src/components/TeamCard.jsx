export default function TeamCard({first, last, major, grad, role, image, linkedIn}){

  console.log("created");

  return (
    <div className="flex flex-col border-white border">
      <img src={image} className="object-cover w-80 h-80 mb-3"></img>
      <h5 className="font-serif font-thin text-2xl text-white tracking-wide mb-1">{first + " " + last}</h5>
      <p className="text-sm">{major + " " + grad}</p>
      <p className="text-sm">{role}</p>
    </div>
  )
}