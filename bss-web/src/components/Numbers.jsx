export default function Info({ number, label, className }){

  return (<div className={className + " flex flex-col items-center text-center"}>
    <h2 className="font-serif text-7xl text-white">{number}</h2>
    <p className="text-wrap font-light text-gray-200">{label}</p>
  </div>)
}