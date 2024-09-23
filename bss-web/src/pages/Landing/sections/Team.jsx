import nodes from "../../../assets/nodes.png";

export default function Team() {
  return (
    <div className="flex pt-28 pb-40 w-full">
      <img src={nodes} className="h-[40vh] sm:ml-24 lg:ml-40" />
      <div className="ml-28">
        <h3 className="font-serif mb-10 text-4xl">Our Team</h3>
        <p className="w-10/12">
          Lorem ipsum odor amet, consectetuer adipiscing elit. Erat condimentum
          libero tempor dolor potenti inceptos consequat natoque. Massa augue
          curae cubilia nec habitasse faucibus quis curabitur. Fames auctor
          curae venenatis sed viverra tempus. Ipsum purus amet aliquam imperdiet
          augue.
        </p>
        <h4 className="font-serif mt-10">Join Us</h4>
        <p className="my-5">Our next recruitment cycle will be in Fall 2024</p>
        <button className="text-white bg-blue-900 hover:bg-blue-800 rounded-sm p-2">More Details</button>
      </div>
    </div>
  );
}
