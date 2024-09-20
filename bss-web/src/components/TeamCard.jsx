export default function TeamCard({firstName, lastName}){

// const headshot = require(`./Headshots/${firstName}_${lastName}.png`)

  return (
    <div className="flex flex-col">
      <img src={require("./Headshots/Ethan_Huang.jpg")}></img>
      <h4>{firstName + " " + lastName}</h4>
    </div>
  )
}