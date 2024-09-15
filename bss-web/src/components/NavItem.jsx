export default function NavItem({className, children}){
  return(
    <button className={`h-0 hover:text-blue-500 hover:underline mb-5 ml-5 text-lg text-white ${className}`}>{children}</button>
  )
}